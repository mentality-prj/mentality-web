/** @jest-environment @edge-runtime/jest-environment */
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'

import { DELETE, GET, POST } from './route'

jest.mock('next/headers', () => ({ cookies: jest.fn() }))
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>

function mockCookie(value?: string) {
  mockedCookies.mockReturnValue({
    get: jest.fn().mockReturnValue(value ? { name: AUTH_TOKEN_COOKIE, value } : undefined),
  } as never)
}

function req(origin: string, method = 'DELETE') {
  return new NextRequest('https://dzvin.example/api/auth/token', { method, headers: { origin } })
}

describe('token-opaque browser session endpoint', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns metadata but never reads out JWTs from the HttpOnly cookie', async () => {
    mockCookie(
      JSON.stringify({
        accessToken: 'hidden-access-token',
        idToken: 'hidden-id-token',
        refreshToken: 'hidden-refresh-token',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
        userRole: 'user',
      })
    )
    const response = await GET()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toMatchObject({ hasRefreshToken: true, userRole: 'user', expiresAt: expect.any(Number) })
    expect(JSON.stringify(data)).not.toMatch(/hidden-.*token/)
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 401 when no session exists', async () => {
    mockCookie()
    expect((await GET()).status).toBe(401)
  })

  it('rejects arbitrary client attempts to write JWT cookies', async () => {
    mockCookie()
    expect((await POST()).status).toBe(405)
  })

  it('blocks cross-origin logout and accepts same-origin logout', async () => {
    mockCookie()
    expect((await DELETE(req('https://attacker.invalid'))).status).toBe(403)
    const response = await DELETE(req('https://dzvin.example'))
    expect(response.status).toBe(200)
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)?.value).toBe('')
  })
})
