/**
 * @jest-environment jsdom
 */

import { ZitadelAuthProvider } from './zitadel'

// ─── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('@/config/zitadel', () => ({
  zitadelConfig: {
    issuer: 'https://test.zitadel.cloud',
    clientId: 'test-client-id',
    redirectUri: 'http://localhost:3000/callback',
    postLogoutRedirectUri: 'http://localhost:3000',
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  },
}))

jest.mock('@/lib/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}))

jest.mock('@/requests/config', () => ({
  APIUrl: 'http://localhost:3200/api',
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeTokensResponse(overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        access_token: 'new-access-token',
        id_token: 'new-id-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
        ...overrides,
      }),
  }
}

function makeStoredTokens(overrides: Record<string, unknown> = {}) {
  return {
    accessToken: 'stored-access-token',
    idToken: 'stored-id-token',
    refreshToken: 'stored-refresh-token',
    expiresAt: Math.floor(Date.now() / 1000) + 3600,
    userRole: 'user',
    ...overrides,
  }
}

function makeBackendUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: 'https://example.com/avatar.png',
    role: 'user',
    ...overrides,
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('ZitadelAuthProvider', () => {
  let provider: ZitadelAuthProvider

  beforeEach(() => {
    provider = new ZitadelAuthProvider()
    jest.clearAllMocks()
    sessionStorage.clear()
  })

  describe('handleCallback', () => {
    it('should throw on state mismatch', async () => {
      sessionStorage.setItem('oauth_state', 'correct-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      await expect(provider.handleCallback('code', 'wrong-state')).rejects.toThrow('State mismatch')
    })

    it('should throw when no saved state', async () => {
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      await expect(provider.handleCallback('code', 'any-state')).rejects.toThrow('State mismatch')
    })

    it('should throw when PKCE verifier is missing', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')

      await expect(provider.handleCallback('code', 'test-state')).rejects.toThrow('Missing PKCE verifier')
    })

    it('should return null when token exchange fails', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'invalid_grant' }),
      })

      const result = await provider.handleCallback('code', 'test-state')
      expect(result).toBeNull()
    })

    it('should return null when backend validation fails', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      // Token exchange succeeds
      mockFetch.mockResolvedValueOnce(makeTokensResponse())
      // Backend validation fails
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

      const result = await provider.handleCallback('code', 'test-state')
      expect(result).toBeNull()
    })

    it('should return user and tokens on success', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      // Token exchange
      mockFetch.mockResolvedValueOnce(makeTokensResponse())
      // Backend validation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeBackendUser()),
      })
      // storeTokens (POST /api/auth/token)
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

      const result = await provider.handleCallback('code', 'test-state')
      expect(result).not.toBeNull()
      expect(result!.user.id).toBe('user-123')
      expect(result!.user.email).toBe('test@example.com')
      expect(result!.tokens.accessToken).toBe('new-access-token')
    })

    it('should clean up sessionStorage after callback', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      mockFetch.mockResolvedValueOnce(makeTokensResponse())
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeBackendUser()),
      })
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

      await provider.handleCallback('code', 'test-state')

      expect(sessionStorage.getItem('oauth_state')).toBeNull()
      expect(sessionStorage.getItem('pkce_verifier')).toBeNull()
    })
  })

  describe('refreshTokens', () => {
    it('should return null when no stored tokens', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null), status: 401 })

      const result = await provider.refreshTokens()
      expect(result).toBeNull()
    })

    it('should return null when no refresh token in stored tokens', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeStoredTokens({ refreshToken: undefined })),
      })

      const result = await provider.refreshTokens()
      expect(result).toBeNull()
    })

    it('should return null when exchange fails', async () => {
      // fetchStoredTokens
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeStoredTokens()),
      })
      // exchange fails
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

      const result = await provider.refreshTokens()
      expect(result).toBeNull()
    })

    it('should return refreshed tokens and preserve userRole', async () => {
      // fetchStoredTokens
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeStoredTokens({ userRole: 'admin' })),
      })
      // exchange succeeds
      mockFetch.mockResolvedValueOnce(makeTokensResponse())
      // storeTokens
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

      const result = await provider.refreshTokens()
      expect(result).not.toBeNull()
      expect(result!.accessToken).toBe('new-access-token')
      expect(result!.userRole).toBe('admin')
    })

    it('should keep existing refresh token if not returned', async () => {
      // fetchStoredTokens
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeStoredTokens()),
      })
      // exchange returns no refresh_token
      mockFetch.mockResolvedValueOnce(makeTokensResponse({ refresh_token: undefined }))
      // storeTokens
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

      const result = await provider.refreshTokens()
      expect(result!.refreshToken).toBe('stored-refresh-token')
    })
  })

  describe('getUser', () => {
    it('should return null when no tokens stored', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

      const result = await provider.getUser()
      expect(result).toBeNull()
    })

    it('should return user with valid tokens', async () => {
      // fetchStoredTokens
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeStoredTokens()),
      })
      // validateWithBackend
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeBackendUser()),
      })

      const result = await provider.getUser()
      expect(result).not.toBeNull()
      expect(result!.name).toBe('Test User')
    })

    it('should refresh and use new tokens when expired', async () => {
      const expiredTokens = makeStoredTokens({
        expiresAt: Math.floor(Date.now() / 1000) - 3600,
      })

      // fetchStoredTokens (getUser)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(expiredTokens),
      })
      // fetchStoredTokens (refreshTokens)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(expiredTokens),
      })
      // exchange
      mockFetch.mockResolvedValueOnce(makeTokensResponse())
      // storeTokens
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })
      // validateWithBackend — should use NEW access token
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeBackendUser()),
      })

      const result = await provider.getUser()
      expect(result).not.toBeNull()

      // Verify validateWithBackend was called with the refreshed token
      const validateCall = mockFetch.mock.calls[4]
      expect(validateCall[0]).toContain('/auth/validate-token')
      expect(validateCall[1].headers.Authorization).toBe('Bearer new-access-token')
    })
  })

  describe('getToken', () => {
    it('should return access token when valid', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makeStoredTokens()),
      })

      const token = await provider.getToken()
      expect(token).toBe('stored-access-token')
    })

    it('should return null when no tokens', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

      const token = await provider.getToken()
      expect(token).toBeNull()
    })
  })

  describe('getIssuerUrl', () => {
    it('should return the configured issuer', () => {
      expect(provider.getIssuerUrl()).toBe('https://test.zitadel.cloud')
    })
  })

  describe('name', () => {
    it('should be zitadel', () => {
      expect(provider.name).toBe('zitadel')
    })
  })
})
