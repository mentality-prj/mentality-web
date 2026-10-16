/** @jest-environment @edge-runtime/jest-environment */

import { getServerSessionStrict } from '@/lib/auth/server'

import { GET } from './route'

jest.mock('@/lib/auth/server', () => ({
  getServerSessionStrict: jest.fn(),
}))

describe('browser session status', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns HTTP 503 without caching when backend validation is temporarily unavailable', async () => {
    ;(getServerSessionStrict as jest.Mock).mockRejectedValue(new Error('backend offline'))

    const response = await GET()
    expect(response.status).toBe(503)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ error: 'Session validation temporarily unavailable' })
  })

  it('returns HTTP 401 only when the server confirmed no authenticated user', async () => {
    ;(getServerSessionStrict as jest.Mock).mockResolvedValue(null)

    const response = await GET()
    expect(response.status).toBe(401)
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('returns only verified user attributes for a valid session', async () => {
    ;(getServerSessionStrict as jest.Mock).mockResolvedValue({
      user: { id: 'user-1', email: 'user@example.test', name: 'User' },
      OAuthToken: 'not-for-browser',
    })

    const response = await GET()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ id: 'user-1', email: 'user@example.test', name: 'User' })
  })
})
