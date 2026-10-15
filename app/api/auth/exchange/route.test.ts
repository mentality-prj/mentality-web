/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { POST } from '@/app/api/auth/exchange/route'
import { ACTIVE_COMPANY_COOKIE } from '@/lib/auth/companyContext'
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
      origin: 'http://localhost:3000',
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
      expiresAt: expect.any(Number),
      hasRefreshToken: true,
      userRole: 'admin',
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

  it('uses the actual preview origin for the Zitadel authorization-code callback', async () => {
    const previousBase = process.env.NEXT_PUBLIC_BASE_URL
    process.env.NEXT_PUBLIC_BASE_URL = 'https://www.dzvin.co'
    try {
      cookiesMock.mockReturnValue(createCookieStore() as never)
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              access_token: 'server-only-access',
              id_token: 'server-only-id',
              refresh_token: 'server-only-refresh',
              expires_in: 3600,
            })
          ),
      })

      const response = await POST(
        createRequest(
          '/api/auth/exchange',
          { grantType: 'authorization_code', code: 'code', codeVerifier: 'verifier' },
          { origin: 'http://localhost:3000' }
        )
      )

      expect(response.status).toBe(200)
      expect(response.cookies.get(ACTIVE_COMPANY_COOKIE)?.value).toBe('')
      const requestOptions = (global.fetch as jest.Mock).mock.calls[0][1] as RequestInit
      const parameters = requestOptions.body as URLSearchParams
      expect(parameters.get('redirect_uri')).toBe('http://localhost:3000/callback')
      expect(JSON.stringify(await response.json())).not.toMatch(/access_token|id_token|refresh_token/)
    } finally {
      process.env.NEXT_PUBLIC_BASE_URL = previousBase
    }
  })

  it('rejects missing Origin, including a browser-like request, without an IdP call', async () => {
    const response = await POST(
      new NextRequest('http://localhost:3000/api/auth/exchange', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'sec-fetch-site': 'same-origin' },
        body: JSON.stringify({ grantType: 'authorization_code', code: 'code', codeVerifier: 'verifier' }),
      })
    )
    expect(response.status).toBe(403)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects a forged cross-site fetch context even with a matching Origin', async () => {
    const response = await POST(
      createRequest('/api/auth/exchange', { grantType: 'refresh_token' }, { 'sec-fetch-site': 'cross-site' })
    )
    expect(response.status).toBe(403)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('does not reflect secrets in identity provider failures', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify({ error: 'invalid_grant', client_secret: 'do-not-leak' })),
    })
    const response = await POST(
      createRequest('/api/auth/exchange', { grantType: 'authorization_code', code: 'bad', codeVerifier: 'verifier' })
    )
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Identity provider request failed' })
  })

  it('does not reflect internal exception details', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('sensitive-upstream-internal-url'))
    const response = await POST(
      createRequest('/api/auth/exchange', { grantType: 'authorization_code', code: 'bad', codeVerifier: 'verifier' })
    )
    expect(response.status).toBe(502)
    expect(JSON.stringify(await response.json())).not.toContain('sensitive-upstream')
  })

  it('rejects an oversized request body before contacting Zitadel', async () => {
    const response = await POST(
      createRequest('/api/auth/exchange', {
        grantType: 'authorization_code',
        code: 'x'.repeat(9_000),
        codeVerifier: 'verifier',
      })
    )
    expect(response.status).toBe(413)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('accepts a streamed upstream token response of exactly 32 KiB', async () => {
    const basePayload = { access_token: 'server-access', id_token: 'server-id', expires_in: 3600, padding: '' }
    const baseLength = JSON.stringify(basePayload).length
    const payload = JSON.stringify({ ...basePayload, padding: 'x'.repeat(32_768 - baseLength) })
    const bytes = new TextEncoder().encode(payload)
    expect(bytes.byteLength).toBe(32_768)
    ;(global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(bytes.slice(0, 9_000))
            controller.enqueue(bytes.slice(9_000, 24_000))
            controller.enqueue(bytes.slice(24_000))
            controller.close()
          },
        }),
        { status: 200 }
      )
    )

    const response = await POST(
      createRequest('/api/auth/exchange', {
        grantType: 'authorization_code',
        code: 'code',
        codeVerifier: 'verifier',
      })
    )

    expect(response.status).toBe(200)
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)?.value).toBeTruthy()
    expect(JSON.stringify(await response.json())).not.toContain('server-access')
  })

  it('rejects an oversized multi-chunk upstream response and cancels its stream', async () => {
    let cancelled = false
    const bytes = new TextEncoder().encode('x'.repeat(32_769))
    ;(global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(bytes.slice(0, 12_000))
            controller.enqueue(bytes.slice(12_000, 29_000))
            controller.enqueue(bytes.slice(29_000))
          },
          cancel() {
            cancelled = true
          },
        }),
        { status: 200 }
      )
    )

    const response = await POST(
      createRequest('/api/auth/exchange', {
        grantType: 'authorization_code',
        code: 'code',
        codeVerifier: 'verifier',
      })
    )

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Identity provider temporarily unavailable' })
    expect(response.cookies.get(AUTH_TOKEN_COOKIE)).toBeUndefined()
    expect(cancelled).toBe(true)
  })

  it('returns 504 if the upstream response body stalls after successful headers', async () => {
    const timeout = new AbortController()
    const signalSpy = jest.spyOn(AbortSignal, 'timeout').mockReturnValue(timeout.signal)
    try {
      ;(global.fetch as jest.Mock).mockImplementation(async (_url: string, init: RequestInit) => {
        const signal = init.signal as AbortSignal
        return new Response(
          new ReadableStream<Uint8Array>({
            start(stream) {
              const abortRead = () => stream.error(new DOMException('Stream aborted', 'AbortError'))
              if (signal.aborted) abortRead()
              else signal.addEventListener('abort', abortRead, { once: true })
            },
          }),
          { status: 200 }
        )
      })

      const result = POST(
        createRequest('/api/auth/exchange', {
          grantType: 'authorization_code',
          code: 'code',
          codeVerifier: 'verifier',
        })
      )
      setTimeout(() => timeout.abort(new DOMException('Request timed out', 'TimeoutError')), 0)

      const response = await result
      expect(response.status).toBe(504)
      expect(await response.json()).toEqual({ error: 'Identity provider temporarily unavailable' })
      expect(response.cookies.get(AUTH_TOKEN_COOKIE)).toBeUndefined()
    } finally {
      signalSpy.mockRestore()
    }
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
