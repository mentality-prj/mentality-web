import { logger } from '@/lib/logger'
import {
  deleteStoredAuthTokens,
  exchangeAuthTokens,
  fetchStoredAuthTokens,
  getCurrentUser,
  storeAuthTokens,
  validateAccessToken,
  validateToken,
} from '@/requests/auth'
import { performAuthRequest } from '@/requests/genericFetch'
import type { AuthTokens, CustomSession } from '@/types/auth'

jest.mock('@/requests/genericFetch', () => ({
  performAuthRequest: jest.fn(),
}))

jest.mock('@/requests/config', () => ({
  APIUrl: 'http://localhost:3200/api///',
}))

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}))

const mockFetch = jest.fn()
const originalFetch = global.fetch

global.fetch = mockFetch

const mockSession: CustomSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'user@test.com',
    role: 'user',
  },
  OAuthToken: 'token',
  expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
}

const storedTokens: AuthTokens = {
  accessToken: 'stored-access-token',
  idToken: 'stored-id-token',
  expiresAt: Math.floor(Date.now() / 1000) + 3600,
  hasRefreshToken: true,
}

describe('auth requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  it('validateToken posts dto to backend auth endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '1', email: 'user@test.com' }),
    })

    const result = await validateToken({
      token: 'jwt-token',
      email: 'user@test.com',
      provider: 'zitadel',
    })

    expect(result).toEqual({
      data: { id: '1', email: 'user@test.com' },
    })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3200/api/auth/validate-token', {
      method: 'POST',
      headers: expect.any(Headers),
      body: JSON.stringify({
        token: 'jwt-token',
        email: 'user@test.com',
        provider: 'zitadel',
      }),
    })
  })

  it('validateAccessToken sends bearer token and returns normalized user payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          _id: 'user-123',
          email: 'user@test.com',
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.png',
          role: 'user',
        }),
    })

    const result = await validateAccessToken('access-token')

    expect(result).toEqual({
      data: expect.objectContaining({ _id: 'user-123', email: 'user@test.com' }),
    })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3200/api/auth/validate-token', {
      method: 'POST',
      headers: expect.any(Headers),
      body: undefined,
    })

    const headers = mockFetch.mock.calls[0][1].headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer access-token')
  })

  it('exchangeAuthTokens posts to internal exchange route and normalizes upstream error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve({ error: 'invalid_grant' }),
    })

    const result = await exchangeAuthTokens({
      grantType: 'authorization_code',
      code: 'auth-code',
      codeVerifier: 'verifier',
    })

    expect(result).toEqual({ error: 'invalid_grant', status: 400 })
    expect(logger.error).toHaveBeenCalledWith('Auth exchange failed', {
      error: 'invalid_grant',
      grantType: 'authorization_code',
      status: 400,
    })
  })

  it('stores, fetches and deletes auth tokens through internal auth routes', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(storedTokens) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

    const storeResult = await storeAuthTokens(storedTokens)
    const fetchResult = await fetchStoredAuthTokens()
    await deleteStoredAuthTokens()

    expect(storeResult).toEqual({ data: { ok: true } })
    expect(fetchResult).toEqual(storedTokens)
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/auth/token', {
      method: 'POST',
      headers: expect.any(Headers),
      body: JSON.stringify(storedTokens),
    })
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/auth/token', {
      method: 'GET',
      headers: expect.any(Headers),
      body: undefined,
    })
    expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/auth/token', {
      method: 'DELETE',
      headers: expect.any(Headers),
      body: undefined,
    })
  })

  it('delegates getCurrentUser to performAuthRequest', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({
      data: { id: '1', email: 'user@test.com' },
    })

    const result = await getCurrentUser(mockSession)

    expect(result).toEqual({ data: { id: '1', email: 'user@test.com' } })
    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, 'http://localhost:3200/api/auth/me', {
      method: 'GET',
    })
  })
})
