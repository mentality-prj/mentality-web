import { logger } from '@/lib/logger'
import {
  deleteStoredAuthTokens,
  exchangeAuthTokens,
  fetchAuthenticatedUser,
  fetchStoredAuthTokens,
  getCurrentUser,
} from '@/requests/auth'
import { performAuthRequest } from '@/requests/genericFetch'
import type { BrowserAuthSession, CustomSession } from '@/types/auth'

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

const storedTokens: BrowserAuthSession = {
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

  it('only fetches token-free session metadata and verified user attributes', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(storedTokens) })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', name: 'User', email: 'u@example.test' }),
      })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

    expect(await fetchStoredAuthTokens()).toEqual(storedTokens)
    expect(await fetchAuthenticatedUser()).toEqual({ id: '1', name: 'User', email: 'u@example.test' })
    await deleteStoredAuthTokens()

    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/auth/token', expect.objectContaining({ method: 'GET' }))
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/auth/session', expect.objectContaining({ method: 'GET' }))
    expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/auth/token', expect.objectContaining({ method: 'DELETE' }))
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
