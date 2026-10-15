/** @jest-environment node */
import { apiRequest } from './api-wrapper'

jest.mock('@/requests/config', () => ({
  APIUrl: 'https://backend.example/api',
}))
jest.mock('@/lib/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), debug: jest.fn(), info: jest.fn() },
}))

const originalFetch = global.fetch

afterAll(() => {
  global.fetch = originalFetch
})
beforeEach(() => {
  jest.clearAllMocks()
})

describe('server requests to NestJS', () => {
  it('preserves verified server bearer when caller headers try to override it', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ id: 'record-1' }),
    }) as unknown as typeof fetch

    const result = await apiRequest(
      {
        user: { id: 'user-1', name: 'User', email: 'user@example.test' },
        OAuthToken: 'verified-server-token',
      },
      'https://backend.example/api/mood-record',
      {
        headers: [
          ['Authorization', 'Bearer untrusted-token'],
          ['X-Api-Key', 'untrusted-secret'],
          ['X-Request-Id', 'safe-id'],
        ],
      }
    )

    expect(result.data).toEqual({ id: 'record-1' })
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
    const headers = options.headers as Headers
    expect(url).toBe('https://backend.example/api/mood-record')
    expect(headers.get('authorization')).toBe('Bearer verified-server-token')
    expect(headers.get('x-api-key')).toBeNull()
    expect(headers.get('x-request-id')).toBe('safe-id')
    expect(options.cache).toBe('no-store')
  })
})
