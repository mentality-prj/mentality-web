/**
 * @jest-environment jsdom
 */

import {
  deleteStoredAuthTokens,
  exchangeAuthTokens,
  fetchStoredAuthTokens,
  storeAuthTokens,
  validateAccessToken,
} from '@/requests/auth'

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

jest.mock('@/requests/auth', () => ({
  deleteStoredAuthTokens: jest.fn(),
  exchangeAuthTokens: jest.fn(),
  fetchStoredAuthTokens: jest.fn(),
  storeAuthTokens: jest.fn(),
  validateAccessToken: jest.fn(),
}))

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeExchangeData(overrides: Record<string, unknown> = {}) {
  return {
    access_token: 'new-access-token',
    id_token: 'new-id-token',
    refresh_token: 'new-refresh-token',
    expires_in: 3600,
    ...overrides,
  }
}

function makeExchangeResult(overrides: Record<string, unknown> = {}) {
  return {
    data: makeExchangeData(overrides),
  }
}

function makeStoredTokens(overrides: Record<string, unknown> = {}) {
  return {
    accessToken: 'stored-access-token',
    idToken: 'stored-id-token',
    hasRefreshToken: true,
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
    ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(null)
    ;(exchangeAuthTokens as jest.Mock).mockResolvedValue(makeExchangeResult())
    ;(validateAccessToken as jest.Mock).mockResolvedValue({ data: makeBackendUser() })
    ;(storeAuthTokens as jest.Mock).mockResolvedValue({ data: { ok: true } })
    ;(deleteStoredAuthTokens as jest.Mock).mockResolvedValue(undefined)
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
      ;(exchangeAuthTokens as jest.Mock).mockResolvedValue({ error: 'invalid_grant', status: 400 })

      const result = await provider.handleCallback('code', 'test-state')
      expect(result).toBeNull()
    })

    it('should return null when backend validation fails', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')
      ;(validateAccessToken as jest.Mock).mockResolvedValue({ error: 'Unauthorized' })

      const result = await provider.handleCallback('code', 'test-state')
      expect(result).toBeNull()
    })

    it('should return user and tokens on success', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      const result = await provider.handleCallback('code', 'test-state')
      expect(result).not.toBeNull()
      expect(result!.user.id).toBe('user-123')
      expect(result!.user.email).toBe('test@example.com')
      expect(result!.tokens.accessToken).toBe('new-access-token')
    })

    it('should clean up sessionStorage after callback', async () => {
      sessionStorage.setItem('oauth_state', 'test-state')
      sessionStorage.setItem('pkce_verifier', 'test-verifier')

      await provider.handleCallback('code', 'test-state')

      expect(sessionStorage.getItem('oauth_state')).toBeNull()
      expect(sessionStorage.getItem('pkce_verifier')).toBeNull()
    })
  })

  describe('refreshTokens', () => {
    it('should return null when no stored tokens', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(null)

      const result = await provider.refreshTokens()
      expect(result).toBeNull()
    })

    it('should return null when no refresh token in stored tokens', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(makeStoredTokens({ hasRefreshToken: false }))

      const result = await provider.refreshTokens()
      expect(result).toBeNull()
    })

    it('should return null when exchange fails', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(makeStoredTokens())
      ;(exchangeAuthTokens as jest.Mock).mockResolvedValue({ error: 'Unauthorized', status: 401 })

      const result = await provider.refreshTokens()
      expect(result).toBeNull()
    })

    it('should return refreshed tokens and preserve userRole', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(makeStoredTokens({ userRole: 'admin' }))

      const result = await provider.refreshTokens()
      expect(result).not.toBeNull()
      expect(result!.accessToken).toBe('new-access-token')
      expect(result!.userRole).toBe('admin')
      expect(result!.hasRefreshToken).toBe(true)
      // refreshToken is not exposed to client
      expect(result!.refreshToken).toBeUndefined()
    })

    it('should set hasRefreshToken based on server response', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(makeStoredTokens())
      ;(exchangeAuthTokens as jest.Mock).mockResolvedValue(makeExchangeResult({ refresh_token: undefined }))

      const result = await provider.refreshTokens()
      // hasRefreshToken comes from currentTokens.hasRefreshToken
      expect(result!.hasRefreshToken).toBe(true)
    })
  })

  describe('getUser', () => {
    it('should return null when no tokens stored', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(null)

      const result = await provider.getUser()
      expect(result).toBeNull()
    })

    it('should return user with valid tokens', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(makeStoredTokens())

      const result = await provider.getUser()
      expect(result).not.toBeNull()
      expect(result!.name).toBe('Test User')
    })

    it('should refresh and use new tokens when expired', async () => {
      const expiredTokens = makeStoredTokens({
        expiresAt: Math.floor(Date.now() / 1000) - 3600,
      })

      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValueOnce(expiredTokens).mockResolvedValueOnce(expiredTokens)

      const result = await provider.getUser()
      expect(result).not.toBeNull()

      expect(validateAccessToken).toHaveBeenCalledWith('new-access-token')
    })
  })

  describe('getToken', () => {
    it('should return access token when valid', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(makeStoredTokens())

      const token = await provider.getToken()
      expect(token).toBe('stored-access-token')
    })

    it('should return null when no tokens', async () => {
      ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(null)

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
