/** @jest-environment @edge-runtime/jest-environment */
import { getServerSession } from '@/lib/auth/server'

import { GET } from './route'

jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))

const getSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('verified browser session response', () => {
  beforeEach(() => jest.clearAllMocks())

  it('never returns bearer tokens or session credentials to browser JS', async () => {
    getSession.mockResolvedValue({
      user: { id: '1', name: 'User', email: 'u@example.test' },
      OAuthToken: 'private-bearer-token',
    })
    const result = await GET()
    expect(result.status).toBe(200)
    expect(await result.json()).toEqual({ id: '1', name: 'User', email: 'u@example.test' })
    expect(result.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 401 for anonymous calls', async () => {
    getSession.mockResolvedValue(null)
    expect((await GET()).status).toBe(401)
  })
})
