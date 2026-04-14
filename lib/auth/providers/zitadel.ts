import { zitadelConfig } from '@/config/zitadel'
import { IAuthProvider } from '@/lib/auth/auth-provider'
import { logger } from '@/lib/logger'
import { APIUrl } from '@/requests/config'
import { AuthTokens, CustomSession, CustomUser, UserAI } from '@/types/auth'

// ─── PKCE helpers ───────────────────────────────────────────────────────────

function generateRandomString(length: number): string {
  const array = new Uint8Array(length)
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

// ─── Token storage via httpOnly cookie API routes ───────────────────────────

async function storeTokens(tokens: AuthTokens): Promise<void> {
  await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens),
  })
}

async function fetchStoredTokens(): Promise<AuthTokens | null> {
  try {
    const response = await fetch('/api/auth/token', { method: 'GET' })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

async function deleteTokens(): Promise<void> {
  await fetch('/api/auth/token', { method: 'DELETE' })
}

// ─── Backend validation ─────────────────────────────────────────────────────

async function validateWithBackend(accessToken: string): Promise<UserAI | null> {
  try {
    const response = await fetch(`${APIUrl}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) {
      logger.error('[AUTH:ZITADEL] Backend validation failed', { status: response.status })
      return null
    }
    const data: UserAI = await response.json()
    return data?._id ? data : null
  } catch (error) {
    logger.error('[AUTH:ZITADEL] Backend connection error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
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
      const tokenResponse = await fetch('/api/auth/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantType: 'authorization_code',
          code,
          codeVerifier,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}))
        logger.error('[AUTH:ZITADEL] Token exchange failed', { status: tokenResponse.status, error: errorData })
        throw new Error(`Token exchange failed (${tokenResponse.status}): ${JSON.stringify(errorData)}`)
      }

      const data = await tokenResponse.json()

      const tokens: AuthTokens = {
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      }

      const backendUser = await validateWithBackend(tokens.accessToken)
      if (!backendUser) {
        logger.error('[AUTH:ZITADEL] Backend validation failed after token exchange')
        throw new Error('Backend validation failed — the backend server may be down or does not recognize the token.')
      }

      tokens.userRole = backendUser.role
      await storeTokens(tokens)

      const user = buildUser(backendUser)

      return { user, tokens }
    } catch (error) {
      logger.error('[AUTH:ZITADEL] Callback error', { error: error instanceof Error ? error.message : String(error) })
      return null
    }
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    const currentTokens = await fetchStoredTokens()
    if (!currentTokens?.refreshToken) {
      logger.warn('[AUTH:ZITADEL] No refresh token available')
      return null
    }

    try {
      const response = await fetch('/api/auth/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantType: 'refresh_token',
          refreshToken: currentTokens.refreshToken,
        }),
      })

      if (!response.ok) {
        logger.error('[AUTH:ZITADEL] Token refresh failed', { status: response.status })
        return null
      }

      const data = await response.json()

      const tokens: AuthTokens = {
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token ?? currentTokens.refreshToken,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
        userRole: currentTokens.userRole,
      }

      await storeTokens(tokens)
      return tokens
    } catch (error) {
      logger.error('[AUTH:ZITADEL] Token refresh error', {
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  async logout(): Promise<void> {
    const tokens = await fetchStoredTokens()
    await deleteTokens()

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
    let tokens = await fetchStoredTokens()
    if (!tokens) return null

    if (tokens.expiresAt < Math.floor(Date.now() / 1000)) {
      const refreshed = await this.refreshTokens()
      if (!refreshed) return null
      tokens = refreshed
    }

    const backendUser = await validateWithBackend(tokens.accessToken)
    if (!backendUser) return null

    return buildUser(backendUser)
  }

  async getToken(): Promise<string | null> {
    const tokens = await fetchStoredTokens()
    if (!tokens) return null

    if (tokens.expiresAt < Math.floor(Date.now() / 1000) + 30) {
      const refreshed = await this.refreshTokens()
      return refreshed?.accessToken ?? null
    }

    return tokens.accessToken
  }

  async getSession(): Promise<CustomSession | null> {
    const tokens = await fetchStoredTokens()
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
    return fetchStoredTokens()
  }

  async clearTokens(): Promise<void> {
    return deleteTokens()
  }
}
