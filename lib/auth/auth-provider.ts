import { AuthTokens, CustomSession, CustomUser } from '@/types/auth'

/**
 * AuthProvider interface — implement this to add a new auth provider.
 *
 * All provider-specific logic (endpoints, PKCE, token format, etc.)
 * lives inside the provider implementation. Consumers never import
 * the provider directly — they use `lib/auth/index.ts`.
 */
export interface IAuthProvider {
  /** Provider identifier (for logging/debugging) */
  readonly name: string

  // ─── Client-side (browser) ────────────────────────────────────────
  /** Redirect user to the provider's login page */
  login(): Promise<void>

  /** Handle the OAuth callback — exchange code for tokens, validate with backend */
  handleCallback(code: string, state: string): Promise<{ user: CustomUser; tokens: AuthTokens } | null>

  /** Refresh the access token */
  refreshTokens(): Promise<AuthTokens | null>

  /** Logout — clear tokens and redirect to provider's logout endpoint */
  logout(): Promise<void>

  /** Get user info from stored tokens + backend validation */
  getUser(): Promise<CustomUser | null>

  /** Get a valid access token (auto-refreshing if needed) */
  getToken(): Promise<string | null>

  /** Build a CustomSession from stored auth state */
  getSession(): Promise<CustomSession | null>

  // ─── Token storage (delegated to cookie API routes) ───────────────
  /** Read stored tokens from httpOnly cookie */
  getStoredTokens(): Promise<AuthTokens | null>

  /** Clear stored tokens */
  clearTokens(): Promise<void>

  /** Get the provider's issuer URL (for CSP headers in middleware) */
  getIssuerUrl(): string
}
