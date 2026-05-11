/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { DELETE, GET, POST } from '@/app/api/auth/token/route'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

type MockCookieStore = {
  get: jest.Mock
}

function createCookieStore(cookieValue?: string): MockCookieStore {
  return {
    get: jest.fn().mockImplementation((name: string) => {
      if (name !== AUTH_TOKEN_COOKIE || !cookieValue) {
        return undefined
      }

      return {
        name: AUTH_TOKEN_COOKIE,
        value: cookieValue,
      }
    }),
  }
}

function createRequest(pathname: string, init?: ConstructorParameters<typeof NextRequest>[1]): NextRequest {
  return new NextRequest(new URL(`http://localhost:3000${pathname}`), init)
}

describe('/api/auth/token route', () => {
  const cookiesMock = cookies as jest.MockedFunction<typeof cookies>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401, no-store and clears malformed cookies on GET', async () => {
    cookiesMock.mockReturnValue(createCookieStore('{bad-json') as never)

    const response = await GET()

    expect(response.status).toBe(401)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)?.value).toBe('')
  })

  it('ignores refresh token from request payload and preserves existing stored refresh token only', async () => {
    cookiesMock.mockReturnValue(
      createCookieStore(
        JSON.stringify({
          accessToken: 'old-access-token',
          idToken: 'old-id-token',
          refreshToken: 'stored-refresh-token',
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        })
      ) as never
    )

    const response = await POST(
      createRequest('/api/auth/token', {
        method: 'POST',
        headers: new Headers({
          origin: 'http://localhost:3000',
          host: 'localhost:3000',
          'content-type': 'application/json',
        }),
        body: JSON.stringify({
          accessToken: 'new-access-token',
          idToken: 'new-id-token',
          refreshToken: 'client-refresh-token',
          expiresAt: Math.floor(Date.now() / 1000) + 7200,
          userRole: 'admin',
          unexpected: 'drop-me',
        }),
      })
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ ok: true })
    const storedCookie = response.cookies.get(AUTH_TOKEN_COOKIE)?.value

    expect(storedCookie).toBeTruthy()
    expect(JSON.parse(storedCookie as string)).toEqual({
      accessToken: 'new-access-token',
      idToken: 'new-id-token',
      refreshToken: 'stored-refresh-token',
      expiresAt: expect.any(Number),
      userRole: 'admin',
    })
  })

  it('does not store a client-provided refresh token when no cookie refresh token exists', async () => {
    cookiesMock.mockReturnValue(createCookieStore() as never)

    const response = await POST(
      createRequest('/api/auth/token', {
        method: 'POST',
        headers: new Headers({
          origin: 'http://localhost:3000',
          host: 'localhost:3000',
          'content-type': 'application/json',
        }),
        body: JSON.stringify({
          accessToken: 'new-access-token',
          idToken: 'new-id-token',
          refreshToken: 'client-refresh-token',
          expiresAt: Math.floor(Date.now() / 1000) + 7200,
        }),
      })
    )

    expect(response.status).toBe(200)

    const storedCookie = response.cookies.get(AUTH_TOKEN_COOKIE)?.value

    expect(JSON.parse(storedCookie as string)).toEqual({
      accessToken: 'new-access-token',
      idToken: 'new-id-token',
      expiresAt: expect.any(Number),
    })
  })

  it('requires same-origin for DELETE and still marks the response as no-store', async () => {
    const response = await DELETE(
      createRequest('/api/auth/token', {
        method: 'DELETE',
        headers: new Headers({
          origin: 'https://malicious.example',
          host: 'localhost:3000',
        }),
      })
    )

    expect(response.status).toBe(403)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ error: 'Forbidden' })
  })
})
