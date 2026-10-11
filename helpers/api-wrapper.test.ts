/** @jest-environment jsdom */
import { apiRequest } from './api-wrapper'

jest.mock('@/requests/config', () => ({
  APIUrl: 'https://backend.example/api///',
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

const session = { user: { id: 'user-1', name: 'User', email: 'u@example.test' } }

describe('browser requests to NestJS', () => {
  it('uses the BFF and never exposes the token in a browser Authorization header', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ moodLevel: 4 }),
    }) as unknown as typeof fetch

    const result = await apiRequest(session, 'https://backend.example/api///mood-record?days=1')
    expect(result.data).toEqual({ moodLevel: 4 })
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(url).toBe('/api/backend/mood-record?days=1')
    expect((options.headers as Headers).get('authorization')).toBeNull()
    expect(options.cache).toBe('no-store')
  })

  it('rejects attempts to target another backend host', async () => {
    global.fetch = jest.fn() as unknown as typeof fetch
    const result = await apiRequest(session, 'https://attacker.invalid/api/mood-record')
    expect(result.error?.name).toBe('InvalidBackendUrl')
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
