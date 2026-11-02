/** @jest-environment @edge-runtime/jest-environment */
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { ACTIVE_COMPANY_COOKIE } from '@/lib/auth/companyContext'
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
    const result = await GET()
    expect(result.status).toBe(401)
    expect(result.cookies.get(ACTIVE_COMPANY_COOKIE)).toBeUndefined()
  })

  it('does not clear refreshed cookies in an invalid-token GET response', async () => {
    mockCookie('invalid-json')
    const response = await GET()
    expect(response.status).toBe(401)
    expect(response.cookies.get(ACTIVE_COMPANY_COOKIE)).toBeUndefined()
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)).toBeUndefined()
  })

  it('rejects arbitrary client attempts to write JWT cookies', async () => {
    mockCookie()
    expect((await POST()).status).toBe(405)
  })

  it('rejects stale conditional deletion when another tab rotated the session', async () => {
    const revision = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
    const request = req('https://dzvin.example')
    request.headers.set('x-session-revision', revision)
    request.cookies.set(
      AUTH_TOKEN_COOKIE,
      JSON.stringify({
        accessToken: 'access',
        idToken: 'id',
        refreshToken: 'refresh',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
        sessionRevision: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
      })
    )

    const response = await DELETE(request)
    expect(response.status).toBe(409)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)).toBeUndefined()
  })

  it('conditionally deletes the exact matching session revision', async () => {
    const revision = 'cccccccc-cccc-4ccc-cccc-cccccccccccc'
    const request = req('https://dzvin.example')
    request.headers.set('x-session-revision', revision)
    request.cookies.set(
      AUTH_TOKEN_COOKIE,
      JSON.stringify({
        accessToken: 'access',
        idToken: 'id',
        refreshToken: 'refresh',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
        sessionRevision: revision,
      })
    )

    const response = await DELETE(request)
    expect(response.status).toBe(200)
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)?.value).toBe('')
  })

  it('fails closed for legacy cookies on conditional deletion', async () => {
    const request = req('https://dzvin.example')
    request.headers.set('x-session-revision', 'dddddddd-dddd-4ddd-dddd-dddddddddddd')
    request.cookies.set(
      AUTH_TOKEN_COOKIE,
      JSON.stringify({ accessToken: 'legacy', idToken: 'id', expiresAt: Math.floor(Date.now() / 1000) + 300 })
    )
    const response = await DELETE(request)
    expect(response.status).toBe(409)
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)).toBeUndefined()
  })

  it('blocks cross-origin logout and accepts same-origin logout', async () => {
    mockCookie()
    expect((await DELETE(req('https://attacker.invalid'))).status).toBe(403)
    const response = await DELETE(req('https://dzvin.example'))
    expect(response.status).toBe(200)
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)?.value).toBe('')
    expect(response.cookies.get(ACTIVE_COMPANY_COOKIE)?.value).toBe('')
  })
})
