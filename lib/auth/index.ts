/**
 * Auth abstraction layer — public API.
 *
 * All client-side code should import from here:
 *   import { authService } from '@/lib/auth'
 *
 * To switch providers, change the import below and nothing else.
 */

import { ZitadelAuthProvider } from '@/lib/auth/providers/zitadel'

import type { IAuthProvider } from './auth-provider'

// ── Active provider (change this line to swap providers) ────────────────────
const provider: IAuthProvider = new ZitadelAuthProvider()

// ── Public API (provider-agnostic) ──────────────────────────────────────────
export const authService = {
  /** Provider identifier */
  get name() {
    return provider.name
  },

  login: () => provider.login(),
  handleCallback: (code: string, state: string) => provider.handleCallback(code, state),
  refreshTokens: () => provider.refreshTokens(),
  logout: () => provider.logout(),
  getUser: () => provider.getUser(),
  getToken: () => provider.getToken(),
  getSession: () => provider.getSession(),
  getStoredTokens: () => provider.getStoredTokens(),
  clearTokens: () => provider.clearTokens(),

  /** Issuer URL for CSP headers (used by middleware) */
  getIssuerUrl: () => provider.getIssuerUrl(),
}

// Re-export types for convenience
export type { IAuthProvider } from './auth-provider'
export { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from './constants'
