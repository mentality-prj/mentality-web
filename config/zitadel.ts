const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

/**
 * Zitadel OIDC configuration
 * All values are read from environment variables at build/runtime.
 */
export const zitadelConfig = {
  /** Zitadel issuer URL (e.g. https://your-instance.zitadel.cloud) */
  issuer: process.env.NEXT_PUBLIC_ZITADEL_ISSUER!,

  /** OIDC client ID */
  clientId: process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID!,

  /** Redirect URI after login */
  redirectUri: `${BASE_URL}/callback`,

  /** Post-logout redirect URI */
  postLogoutRedirectUri: BASE_URL || '/',

  /** OIDC scopes */
  scopes: ['openid', 'profile', 'email', 'offline_access'],

  /** JWKS endpoint for token verification */
  get jwksUri() {
    return `${this.issuer}/.well-known/jwks.json`
  },

  /** OpenID Connect discovery endpoint */
  get discoveryUrl() {
    return `${this.issuer}/.well-known/openid-configuration`
  },
} as const
