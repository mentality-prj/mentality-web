import { zitadelConfig } from '@/config/zitadel'
import { IAuthProvider } from '@/lib/auth/auth-provider'
import { logger } from '@/lib/logger'
import {
  deleteStoredAuthTokens,
  deleteStoredAuthTokensIfUnchanged,
  exchangeAuthTokens,
  fetchAuthenticatedUser,
  fetchStoredAuthTokens,
} from '@/requests/auth'
import type { BrowserAuthSession, CustomSession, CustomUser } from '@/types/auth'

function generateRandomString(length: number): string {
  const bytes = new Uint8Array(Math.ceil(length / 2))
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length)
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export class ZitadelAuthProvider implements IAuthProvider {
  readonly name = 'zitadel'
  private refreshInFlight: Promise<BrowserAuthSession | null> | null = null

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
      // Browser and server must use the same exact origin, including preview deployments.
      redirect_uri: new URL('/callback', window.location.origin).toString(),
      scope: zitadelConfig.scopes.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
      prompt: 'select_account',
    })
    window.location.href = `${zitadelConfig.issuer}/oauth/v2/authorize?${params.toString()}`
  }

  async handleCallback(code: string, state: string): Promise<{ user: CustomUser; tokens: BrowserAuthSession } | null> {
    const savedState = sessionStorage.getItem('oauth_state')
    const codeVerifier = sessionStorage.getItem('pkce_verifier')
    if (!savedState || savedState !== state) {
      throw new Error('State mismatch — possible CSRF attack. Try signing in again.')
    }
    if (!codeVerifier) throw new Error('Missing PKCE verifier. Try signing in again.')

    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('pkce_verifier')
    try {
      // The exchange endpoint sets the HttpOnly cookie and returns metadata, not tokens.
      const result = await exchangeAuthTokens({ grantType: 'authorization_code', code, codeVerifier })
      if ('error' in result) throw new Error(`Token exchange failed: ${result.error}`)

      const user = await this.getUser()
      if (!user) {
        // Another tab may have signed in during backend verification. Only
        // discard the exact cookie revision issued by *this* callback.
        await this.clearTokensIfUnchanged(result.data)
        throw new Error('Unable to validate the session')
      }
      return { user, tokens: result.data }
    } catch (error) {
      logger.error('[AUTH:ZITADEL] Callback error', { error: error instanceof Error ? error.message : String(error) })
      return null
    }
  }

  async refreshTokens(): Promise<BrowserAuthSession | null> {
    // A provider instance is shared across React components, while Web Locks
    // serialize refresh-token rotation across *tabs on the same origin*.
    if (this.refreshInFlight) return this.refreshInFlight
    const task = this.refreshOnce()
    this.refreshInFlight = task
    try {
      return await task
    } finally {
      if (this.refreshInFlight === task) this.refreshInFlight = null
    }
  }

  private async refreshOnce(): Promise<BrowserAuthSession | null> {
    const observed = await fetchStoredAuthTokens()
    if (!observed?.hasRefreshToken) return null

    const rotateIfNeeded = async (): Promise<BrowserAuthSession | null> => {
      // Re-read the HttpOnly-cookie metadata *after* acquiring the cross-tab
      // lock. Another tab may already have rotated it while we waited.
      const current = await fetchStoredAuthTokens()
      if (!current?.hasRefreshToken) return null

      const secondsRemaining = current.expiresAt - Math.floor(Date.now() / 1000)
      if (secondsRemaining > 0 && (current.expiresAt > observed.expiresAt || secondsRemaining > 60)) {
        return current
      }

      const result = await exchangeAuthTokens({ grantType: 'refresh_token' })
      if ('error' in result) {
        // Do not mistake a network/IdP outage for revoked refresh credentials.
        // Only a definitive invalid-grant response ends this session.
        const latest = await fetchStoredAuthTokens()
        if (
          latest?.hasRefreshToken &&
          latest.expiresAt > observed.expiresAt &&
          latest.expiresAt > Math.floor(Date.now() / 1000)
        ) {
          return latest
        }
        if (!result.status || result.status === 429 || result.status >= 500) {
          throw new Error('Identity provider temporarily unavailable')
        }
        return null
      }
      return result.data
    }

    if (typeof navigator !== 'undefined' && navigator.locks?.request) {
      return navigator.locks.request('dzvin:zitadel-refresh-v1', { mode: 'exclusive' }, rotateIfNeeded)
    }

    // Compatibility fallback: still uses same-instance single flight. Full
    // cross-tab coordination requires the Web Locks API or a server-side store.
    return rotateIfNeeded()
  }

  async logout(): Promise<void> {
    // Submit a same-origin POST navigation: the server destroys the cookie and
    // redirects to Zitadel with the ID-token hint without returning JWTs to JS.
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/api/auth/logout'
    form.hidden = true
    document.body.appendChild(form)
    form.submit()
  }

  async getUser(): Promise<CustomUser | null> {
    return fetchAuthenticatedUser()
  }

  /** @deprecated Bearer tokens must never be exposed to browser code. */
  async getToken(): Promise<string | null> {
    return null
  }

  async getSession(): Promise<CustomSession | null> {
    const user = await this.getUser()
    return user ? { user, provider: this.name } : null
  }

  async getStoredTokens(): Promise<BrowserAuthSession | null> {
    return fetchStoredAuthTokens()
  }

  async clearTokens(): Promise<void> {
    await deleteStoredAuthTokens()
  }

  async clearTokensIfUnchanged(observed: BrowserAuthSession): Promise<boolean> {
    const clearUnderLock = async (): Promise<boolean> => {
      const current = await fetchStoredAuthTokens()
      if (!current) return true

      // A newer rotation may finish after a failing tab started its request.
      // Its opaque revision (not a JWT) must never be deleted by that stale tab.
      if (current.sessionRevision && observed.sessionRevision) {
        if (current.sessionRevision !== observed.sessionRevision) return false
      } else if (current.expiresAt !== observed.expiresAt) {
        // Safe upgrade path for cookies issued before sessionRevision existed.
        return false
      }

      // Even if a new rotation happens before this HTTP request is handled,
      // the route compares the cookie revision on receipt and rejects a stale
      // deletion rather than issuing Set-Cookie against the newer session.
      return deleteStoredAuthTokensIfUnchanged(observed)
    }

    if (typeof navigator !== 'undefined' && navigator.locks?.request) {
      return navigator.locks.request('dzvin:zitadel-refresh-v1', { mode: 'exclusive' }, clearUnderLock)
    }
    // Best effort on older browsers: check immediately before DELETE.
    return clearUnderLock()
  }
}
