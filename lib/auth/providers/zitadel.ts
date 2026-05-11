import { zitadelConfig } from '@/config/zitadel'
import { IAuthProvider } from '@/lib/auth/auth-provider'
import { logger } from '@/lib/logger'
import {
  deleteStoredAuthTokens,
  exchangeAuthTokens,
  fetchStoredAuthTokens,
  storeAuthTokens,
  validateAccessToken,
} from '@/requests/auth'
import type { AuthTokens, CustomSession, CustomUser, UserAI } from '@/types/auth'

// ─── PKCE helpers ───────────────────────────────────────────────────────────

function generateRandomString(length: number): string {
  const byteCount = Math.ceil(length / 2)
  const array = new Uint8Array(byteCount)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length)
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function buildUser(backendUser: UserAI): CustomUser {
  return {
    id: backendUser._id,
    name: backendUser.name,
    email: backendUser.email,
    image: backendUser.avatarUrl,
    role: backendUser.role,
    isAIAuthorized: true,
  }
}

// ─── Zitadel OIDC Provider ─────────────────────────────────────────────────

export class ZitadelAuthProvider implements IAuthProvider {
  readonly name = 'zitadel'

  getIssuerUrl(): string {
    return zitadelConfig.issuer
  }

  async login(): Promise<void> {
    const codeVerifier = generateRandomString(64)
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateRandomString(32)

    sessionStorage.setItem('pkce_verifier', codeVerifier)
    sessionStorage.setItem('oauth_state', state)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: zitadelConfig.clientId,
      redirect_uri: zitadelConfig.redirectUri,
      scope: zitadelConfig.scopes.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
      prompt: 'select_account',
    })

    window.location.href = `${zitadelConfig.issuer}/oauth/v2/authorize?${params.toString()}`
  }

  /** @throws {Error} On state mismatch (CSRF) or missing PKCE verifier */
  async handleCallback(code: string, state: string): Promise<{ user: CustomUser; tokens: AuthTokens } | null> {
    const savedState = sessionStorage.getItem('oauth_state')
    const codeVerifier = sessionStorage.getItem('pkce_verifier')

    if (!savedState || savedState !== state) {
      logger.error('[AUTH:ZITADEL] State mismatch — possible CSRF', {
        savedState: !!savedState,
        stateMatch: savedState === state,
      })
      throw new Error('State mismatch — possible CSRF attack. Try signing in again.')
    }

    if (!codeVerifier) {
      logger.error('[AUTH:ZITADEL] Missing PKCE verifier')
      throw new Error('Missing PKCE verifier. Try signing in again.')
    }

    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('pkce_verifier')

    try {
      const exchangeResult = await exchangeAuthTokens({
        grantType: 'authorization_code',
        code,
        codeVerifier,
      })

      if ('error' in exchangeResult) {
        throw new Error(`Token exchange failed (${exchangeResult.status ?? 'unknown'}): ${exchangeResult.error}`)
      }

      const data = exchangeResult.data

      const tokens: AuthTokens = {
        accessToken: data.access_token,
        idToken: data.id_token,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      }

      const validationResult = await validateAccessToken(tokens.accessToken)

      if ('error' in validationResult) {
        logger.error('[AUTH:ZITADEL] Backend validation failed after token exchange')
        throw new Error('Backend validation failed — the backend server may be down or does not recognize the token.')
      }

      const backendUser = validationResult.data

      // Update the cookie with userRole (exchange route already stored the base tokens)
      tokens.userRole = backendUser.role
      const storeResult = await storeAuthTokens(tokens)

      if ('error' in storeResult) {
        throw new Error(`Failed to store tokens (${storeResult.status ?? 'unknown'}): ${storeResult.error}`)
      }

      const user = buildUser(backendUser)

      return { user, tokens }
    } catch (error) {
      logger.error('[AUTH:ZITADEL] Callback error', { error: error instanceof Error ? error.message : String(error) })
      return null
    }
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    const currentTokens = await fetchStoredAuthTokens()
    if (!currentTokens?.refreshToken && !currentTokens?.hasRefreshToken) {
      logger.warn('[AUTH:ZITADEL] No refresh token available')
      return null
    }

    try {
      const exchangeResult = await exchangeAuthTokens({
        grantType: 'refresh_token',
      })

      if ('error' in exchangeResult) {
        return null
      }

      const data = exchangeResult.data

      // The exchange route updates the cookie server-side (preserving refresh token).
      // Return only the client-safe fields.
      return {
        accessToken: data.access_token,
        idToken: data.id_token,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
        userRole: currentTokens.userRole,
        hasRefreshToken: currentTokens.hasRefreshToken ?? false,
      }
    } catch (error) {
      logger.error('[AUTH:ZITADEL] Token refresh error', {
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  async logout(): Promise<void> {
    const tokens = await fetchStoredAuthTokens()
    await deleteStoredAuthTokens()

    const params = new URLSearchParams({
      client_id: zitadelConfig.clientId,
      post_logout_redirect_uri: zitadelConfig.postLogoutRedirectUri,
    })

    if (tokens?.idToken) {
      params.set('id_token_hint', tokens.idToken)
    }

    window.location.href = `${zitadelConfig.issuer}/oidc/v1/end_session?${params.toString()}`
  }

  async getUser(): Promise<CustomUser | null> {
    let tokens = await fetchStoredAuthTokens()
    if (!tokens) return null

    if (tokens.expiresAt < Math.floor(Date.now() / 1000)) {
      const refreshed = await this.refreshTokens()
      if (!refreshed) return null
      tokens = refreshed
    }

    const validationResult = await validateAccessToken(tokens.accessToken)
    if ('error' in validationResult) return null

    return buildUser(validationResult.data)
  }

  async getToken(): Promise<string | null> {
    const tokens = await fetchStoredAuthTokens()
    if (!tokens) return null

    if (tokens.expiresAt < Math.floor(Date.now() / 1000) + 30) {
      const refreshed = await this.refreshTokens()
      return refreshed?.accessToken ?? null
    }

    return tokens.accessToken
  }

  async getSession(): Promise<CustomSession | null> {
    const tokens = await fetchStoredAuthTokens()
    if (!tokens) return null

    const user = await this.getUser()
    if (!user) return null

    return {
      user,
      OAuthToken: tokens.accessToken,
      provider: this.name,
    }
  }

  async getStoredTokens(): Promise<AuthTokens | null> {
    return fetchStoredAuthTokens()
  }

  async clearTokens(): Promise<void> {
    return deleteStoredAuthTokens()
  }
}
