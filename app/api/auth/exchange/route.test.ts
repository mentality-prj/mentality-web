/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { POST } from '@/app/api/auth/exchange/route'
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

function createRequest(pathname: string, body: unknown, headers?: Record<string, string>): NextRequest {
  return new NextRequest(new URL(`http://localhost:3000${pathname}`), {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json',
      ...headers,
    }),
    body: JSON.stringify(body),
  })
}

describe('/api/auth/exchange route', () => {
  const cookiesMock = cookies as jest.MockedFunction<typeof cookies>
  const originalFetch = global.fetch
  const originalEnv = {
    NEXT_PUBLIC_ZITADEL_ISSUER: process.env.NEXT_PUBLIC_ZITADEL_ISSUER,
    NEXT_PUBLIC_ZITADEL_CLIENT_ID: process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID,
    ZITADEL_CLIENT_SECRET: process.env.ZITADEL_CLIENT_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  }

  beforeAll(() => {
    process.env.NEXT_PUBLIC_ZITADEL_ISSUER = 'https://test.zitadel.cloud'
    process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID = 'client-id'
    process.env.ZITADEL_CLIENT_SECRET = 'secret'
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_ZITADEL_ISSUER = originalEnv.NEXT_PUBLIC_ZITADEL_ISSUER
    process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID = originalEnv.NEXT_PUBLIC_ZITADEL_CLIENT_ID
    process.env.ZITADEL_CLIENT_SECRET = originalEnv.ZITADEL_CLIENT_SECRET
    process.env.NEXT_PUBLIC_BASE_URL = originalEnv.NEXT_PUBLIC_BASE_URL
    global.fetch = originalFetch
  })

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn() as unknown as typeof fetch
  })

  it('returns 502 and no-store when the identity provider payload is malformed', async () => {
    cookiesMock.mockReturnValue(createCookieStore() as never)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ expires_in: 3600 })),
    })

    const response = await POST(
      createRequest('/api/auth/exchange', {
        grantType: 'authorization_code',
        code: 'auth-code',
        codeVerifier: 'verifier',
      })
    )

    expect(response.status).toBe(502)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ error: 'Invalid token response from identity provider' })
  })

  it('uses stored refresh token and stored id token fallback on refresh grants', async () => {
    cookiesMock.mockReturnValue(
      createCookieStore(
        JSON.stringify({
          accessToken: 'old-access-token',
          idToken: 'stored-id-token',
          refreshToken: 'stored-refresh-token',
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
          userRole: 'admin',
        })
      ) as never
    )
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ access_token: 'refreshed-access-token', expires_in: 1800 })),
    })

    const response = await POST(
      createRequest('/api/auth/exchange', { grantType: 'refresh_token' }, { origin: 'http://localhost:3000' })
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({
      access_token: 'refreshed-access-token',
      id_token: 'stored-id-token',
      expires_in: 1800,
    })
    const storedCookie = response.cookies.get(AUTH_TOKEN_COOKIE)?.value

    expect(storedCookie).toBeTruthy()
    expect(JSON.parse(storedCookie as string)).toEqual({
      accessToken: 'refreshed-access-token',
      idToken: 'stored-id-token',
      refreshToken: 'stored-refresh-token',
      expiresAt: expect.any(Number),
      userRole: 'admin',
    })
  })

  it('returns 400 for invalid JSON bodies', async () => {
    cookiesMock.mockReturnValue(createCookieStore() as never)

    const response = await POST(
      new NextRequest(new URL('http://localhost:3000/api/auth/exchange'), {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          origin: 'http://localhost:3000',
        }),
        body: '{bad-json',
      })
    )

    expect(response.status).toBe(400)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ error: 'Invalid JSON' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects cross-origin browser requests before contacting Zitadel', async () => {
    cookiesMock.mockReturnValue(createCookieStore() as never)

    const response = await POST(
      createRequest(
        '/api/auth/exchange',
        {
          grantType: 'authorization_code',
          code: 'auth-code',
          codeVerifier: 'verifier',
        },
        {
          origin: 'https://malicious.example',
        }
      )
    )

    expect(response.status).toBe(403)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ error: 'Forbidden' })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
