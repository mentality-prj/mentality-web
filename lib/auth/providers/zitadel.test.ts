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
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined })
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

  it('deduplicates concurrent refresh calls within one tab', async () => {
    const expiring = { ...metadata, expiresAt: Math.floor(Date.now() / 1000) + 15 }
    ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(expiring)
    const results = await Promise.all([provider.refreshTokens(), provider.refreshTokens()])
    expect(results).toEqual([metadata, metadata])
    expect(exchangeAuthTokens).toHaveBeenCalledTimes(1)
    expect(fetchStoredAuthTokens).toHaveBeenCalledTimes(2)
  })

  it('does not rotate a session which has more than 60 seconds remaining', async () => {
    expect(await provider.refreshTokens()).toEqual(metadata)
    expect(exchangeAuthTokens).not.toHaveBeenCalled()
  })

  it('serializes two tabs with Web Locks and re-reads the cookie before rotating', async () => {
    let current = { ...metadata, expiresAt: Math.floor(Date.now() / 1000) + 15 }
    let lastLock: Promise<unknown> = Promise.resolve()
    const request = jest.fn((_name: string, _options: LockOptions, callback: () => Promise<unknown>) => {
      const next = lastLock.then(callback)
      lastLock = next.catch(() => undefined)
      return next
    })
    Object.defineProperty(navigator, 'locks', { configurable: true, value: { request } })
    ;(fetchStoredAuthTokens as jest.Mock).mockImplementation(async () => current)
    ;(exchangeAuthTokens as jest.Mock).mockImplementation(async () => {
      current = metadata
      return { data: metadata }
    })

    const anotherTab = new ZitadelAuthProvider()
    const [first, second] = await Promise.all([provider.refreshTokens(), anotherTab.refreshTokens()])

    expect(first).toEqual(metadata)
    expect(second).toEqual(metadata)
    expect(request).toHaveBeenCalledTimes(2)
    expect(exchangeAuthTokens).toHaveBeenCalledTimes(1)
    expect(fetchStoredAuthTokens).toHaveBeenCalledTimes(4)
  })

  it('does not retry a failed rotation in a tight loop', async () => {
    const expiring = { ...metadata, expiresAt: Math.floor(Date.now() / 1000) + 15 }
    ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(expiring)
    ;(exchangeAuthTokens as jest.Mock).mockResolvedValue({
      error: 'Identity provider temporarily unavailable',
      status: 503,
    })

    expect(await provider.refreshTokens()).toBeNull()
    expect(exchangeAuthTokens).toHaveBeenCalledTimes(1)
  })

  it('preserves a newer rotated cookie when stale cleanup acquires the refresh lock', async () => {
    const observed = { ...metadata, sessionRevision: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa' }
    const newer = { ...metadata, sessionRevision: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb' }
    const request = jest.fn((_name: string, _options: LockOptions, callback: () => Promise<unknown>) => callback())
    Object.defineProperty(navigator, 'locks', { configurable: true, value: { request } })
    ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(newer)

    expect(await provider.clearTokensIfUnchanged(observed)).toBe(false)
    expect(request).toHaveBeenCalledWith('dzvin:zitadel-refresh-v1', { mode: 'exclusive' }, expect.any(Function))
    expect(deleteStoredAuthTokens).not.toHaveBeenCalled()
  })

  it('deletes an unchanged cookie only while holding the rotation lock', async () => {
    const observed = { ...metadata, sessionRevision: 'cccccccc-cccc-4ccc-cccc-cccccccccccc' }
    ;(fetchStoredAuthTokens as jest.Mock).mockResolvedValue(observed)
    let lockHeld = false
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request: async (_name: string, _options: LockOptions, callback: () => Promise<unknown>) => {
          lockHeld = true
          try {
            return await callback()
          } finally {
            lockHeld = false
          }
        },
      },
    })
    ;(deleteStoredAuthTokens as jest.Mock).mockImplementation(async () => {
      expect(lockHeld).toBe(true)
    })
    expect(await provider.clearTokensIfUnchanged(observed)).toBe(true)
    expect(deleteStoredAuthTokens).toHaveBeenCalledTimes(1)
  })

  it('never yields a bearer token through the client API', async () => {
    expect(await provider.getToken()).toBeNull()
    expect(await provider.getSession()).toEqual({ user: testUser, provider: 'zitadel' })
  })
})
