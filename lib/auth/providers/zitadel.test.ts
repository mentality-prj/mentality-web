/** @jest-environment jsdom */

import {
  deleteStoredAuthTokens,
  exchangeAuthTokens,
  fetchAuthenticatedUser,
  fetchStoredAuthTokens,
} from '@/requests/auth'

import { ZitadelAuthProvider } from './zitadel'

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
  fetchAuthenticatedUser: jest.fn(),
  fetchStoredAuthTokens: jest.fn(),
}))

const metadata = { expiresAt: Math.floor(Date.now() / 1000) + 3600, hasRefreshToken: true }
const testUser = { id: '1', name: 'Test User', email: 'test@example.test', role: 'user' as const }

describe('token-opaque Zitadel provider', () => {
  let provider: ZitadelAuthProvider

  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    provider = new ZitadelAuthProvider()
    ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(metadata)
    ;(exchangeAuthTokens as jest.Mock).mockResolvedValue({ data: metadata })
    ;(fetchAuthenticatedUser as jest.Mock).mockResolvedValue(testUser)
    ;(deleteStoredAuthTokens as jest.Mock).mockResolvedValue(undefined)
  })

  it('rejects state mismatch before reaching exchange', async () => {
    sessionStorage.setItem('oauth_state', 'correct')
    sessionStorage.setItem('pkce_verifier', 'verifier')
    await expect(provider.handleCallback('code', 'wrong')).rejects.toThrow(/State mismatch/)
    expect(exchangeAuthTokens).not.toHaveBeenCalled()
  })

  it('clears PKCE state, completes callback and returns metadata only', async () => {
    sessionStorage.setItem('oauth_state', 'correct')
    sessionStorage.setItem('pkce_verifier', 'verifier')
    const result = await provider.handleCallback('code', 'correct')
    expect(result).toEqual({ user: testUser, tokens: metadata })
    expect(sessionStorage.getItem('pkce_verifier')).toBeNull()
    expect(result?.tokens).not.toHaveProperty('accessToken')
    expect(result?.tokens).not.toHaveProperty('idToken')
  })

  it('revokes local cookie if backend user verification fails', async () => {
    sessionStorage.setItem('oauth_state', 'correct')
    sessionStorage.setItem('pkce_verifier', 'verifier')
    ;(fetchAuthenticatedUser as jest.Mock).mockResolvedValue(null)
    expect(await provider.handleCallback('code', 'correct')).toBeNull()
    expect(deleteStoredAuthTokens).toHaveBeenCalledTimes(1)
  })

  it('deduplicates concurrent refresh calls', async () => {
    const results = await Promise.all([provider.refreshTokens(), provider.refreshTokens()])
    expect(results).toEqual([metadata, metadata])
    expect(exchangeAuthTokens).toHaveBeenCalledTimes(1)
    expect(fetchStoredAuthTokens).toHaveBeenCalledTimes(1)
  })

  it('never yields a bearer token through the client API', async () => {
    expect(await provider.getToken()).toBeNull()
    expect(await provider.getSession()).toEqual({ user: testUser, provider: 'zitadel' })
  })
})
