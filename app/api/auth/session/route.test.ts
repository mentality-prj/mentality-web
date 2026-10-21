/** @jest-environment @edge-runtime/jest-environment */
import { getServerSessionStrict } from '@/lib/auth/server'

import { GET } from './route'

jest.mock('@/lib/auth/server', () => ({ getServerSessionStrict: jest.fn() }))

const getSession = getServerSessionStrict as jest.MockedFunction<typeof getServerSessionStrict>

describe('verified browser session response', () => {
  beforeEach(() => jest.clearAllMocks())

  it('never returns bearer tokens or session credentials to browser JS', async () => {
    getSession.mockResolvedValue({
      user: {
        id: '1',
        name: 'User',
        email: 'u@example.test',
        companyId: 'company-1',
        companyRole: 'manager',
      },
      OAuthToken: 'private-bearer-token',
    })
    const result = await GET()
    expect(result.status).toBe(200)
    expect(await result.json()).toEqual({
      id: '1',
      name: 'User',
      email: 'u@example.test',
      companyId: 'company-1',
      companyRole: 'manager',
    })
    expect(result.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 401 for anonymous calls', async () => {
    getSession.mockResolvedValue(null)
    expect((await GET()).status).toBe(401)
  })
})
