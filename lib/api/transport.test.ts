/** @jest-environment jsdom */
import { apiTransport } from './transport'

const originalFetch = global.fetch

afterAll(() => {
  global.fetch = originalFetch
})
beforeEach(() => {
  jest.clearAllMocks()
})

describe('canonical API HTTP transport', () => {
  it('routes browser app requests only through the same-origin Next.js API', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response('{}', { status: 200 })) as unknown as typeof fetch
    await apiTransport('/api/backend/mood-record?limit=1')
    expect(global.fetch).toHaveBeenCalledWith('/api/backend/mood-record?limit=1', {
      cache: 'no-store',
    })
  })

  it.each([
    'https://backend.example/api/mood-record',
    '//backend.example/api/mood-record',
    '/en/admin/dip/system/key-flash',
    '/api/%2f%2fattacker.invalid',
    '/api/\\redirect',
  ])('denies browser network calls outside the canonical API: %s', async (url) => {
    global.fetch = jest.fn() as unknown as typeof fetch
    await expect(apiTransport(url)).rejects.toThrow('same-origin /api/')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it.each([
    ['Authorization', 'Bearer injected'],
    ['x-api-key', 'secret'],
    ['Cookie', 'auth-tokens=bad'],
    ['X-Dip-Admin-Api-Key', 'admin-key'],
  ])('denies caller credential header %s', async (name, value) => {
    global.fetch = jest.fn() as unknown as typeof fetch
    await expect(apiTransport('/api/backend/mood-record', { headers: { [name]: value } })).rejects.toThrow(
      'cannot provide credentials'
    )
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
