/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { NextRequest } from 'next/server'

import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'

// Mock next-intl routing
jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'uk', 'pl'],
    defaultLocale: 'uk',
  },
}))

const originalFetch = globalThis.fetch

const savedEnv = {
  NEXT_PUBLIC_ZITADEL_ISSUER: process.env.NEXT_PUBLIC_ZITADEL_ISSUER,
  NEXT_PUBLIC_ZITADEL_CLIENT_ID: process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID,
  ZITADEL_CLIENT_SECRET: process.env.ZITADEL_CLIENT_SECRET,
}

function makeTokenCookie(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    accessToken: 'valid-access-token',
    idToken: 'valid-id-token',
    refreshToken: 'valid-refresh-token',
    expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    ...overrides,
  })
}

describe('Middleware Token-Based Auth', () => {
  let middleware: (req: NextRequest) => Promise<Response>
  let config: { matcher: string[] }

  beforeAll(() => {
    process.env.NEXT_PUBLIC_ZITADEL_ISSUER = 'https://test.zitadel.cloud'
    process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID = 'test-client-id'
    process.env.ZITADEL_CLIENT_SECRET = 'test-client-secret'
    const middlewareModule = require('@/middleware') as {
      middleware: (req: NextRequest) => Promise<Response>
      config: { matcher: string[] }
    }
    middleware = middlewareModule.middleware
    config = middlewareModule.config
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_ZITADEL_ISSUER = savedEnv.NEXT_PUBLIC_ZITADEL_ISSUER
    process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID = savedEnv.NEXT_PUBLIC_ZITADEL_CLIENT_ID
    process.env.ZITADEL_CLIENT_SECRET = savedEnv.ZITADEL_CLIENT_SECRET
  })

  beforeEach(() => {
    jest.clearAllMocks()
    globalThis.fetch = originalFetch
  })

  const createRequest = (
    pathname: string,
    cookieValue?: string,
    init?: ConstructorParameters<typeof NextRequest>[1]
  ) => {
    const req = new NextRequest(new URL(`http://localhost:3000${pathname}`), init)
    if (cookieValue) {
      req.cookies.set(AUTH_TOKEN_COOKIE, cookieValue)
    }
    return req
  }

  describe('Unauthenticated access to protected routes', () => {
    it('should redirect to auth when no token cookie exists', async () => {
      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/auth')
    })

    it('should redirect to auth when token cookie is invalid JSON', async () => {
      const request = createRequest('/uk/my-day', 'not-valid-json')
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/auth')
    })

    it('should redirect to auth when token cookie has no accessToken', async () => {
      const request = createRequest('/uk/my-day', JSON.stringify({ idToken: 'some-token' }))
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/auth')
    })

    it('should redirect to auth when token cookie contains only whitespace tokens', async () => {
      const request = createRequest(
        '/uk/my-day',
        JSON.stringify({
          accessToken: '   ',
          idToken: '   ',
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        })
      )
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/auth')
    })
  })

  describe('Authenticated access', () => {
    it('should not redirect on protected route with valid token', async () => {
      const request = createRequest('/uk/my-day', makeTokenCookie())
      const response = await middleware(request)

      const location = response.headers.get('location')
      if (location) {
        expect(location).not.toContain('/auth')
        expect(location).not.toContain('/server-error')
      }
    })

    it('should redirect authenticated user away from auth to my-day', async () => {
      const request = createRequest('/uk/auth', makeTokenCookie())
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/my-day')
    })
  })

  describe('Expired token handling', () => {
    it('should redirect to auth when token expired and no refresh token', async () => {
      const request = createRequest(
        '/uk/my-day',
        makeTokenCookie({
          expiresAt: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
          refreshToken: undefined,
        })
      )
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/auth')
    })

    it('should redirect to same URL with refreshed cookie when token expired but refresh token exists', async () => {
      // Mock the internal /api/auth/exchange route called by middleware for server-side refresh
      // Note: the real route strips refresh_token from JSON response (stored in httpOnly cookie only)
      // and sets the cookie via Set-Cookie header
      const mockCookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(JSON.stringify({ accessToken: 'refreshed-access-token', idToken: 'refreshed-id-token', refreshToken: 'new-refresh', expiresAt: Math.floor(Date.now() / 1000) + 3600 }))}; Path=/; HttpOnly; SameSite=Lax`
      globalThis.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'set-cookie': mockCookie }),
        json: () =>
          Promise.resolve({
            access_token: 'refreshed-access-token',
            id_token: 'refreshed-id-token',
            expires_in: 3600,
          }),
      })

      const request = createRequest(
        '/uk/my-day',
        makeTokenCookie({
          expiresAt: Math.floor(Date.now() / 1000) - 3600, // expired
          refreshToken: 'valid-refresh-token',
        })
      )
      const response = await middleware(request)

      // After successful refresh, middleware redirects to the same URL
      // so server components see the updated cookie
      const location = response.headers.get('location')
      expect(location).not.toContain('/auth')
      expect(location).toContain('/uk/my-day')
    })
  })

  describe('Public routes', () => {
    it('should redirect non-locale pages to the preferred locale', async () => {
      const request = createRequest('/about')
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/uk/about')
    })

    it('should allow unauthenticated access to public routes', async () => {
      const request = createRequest('/uk/about')
      const response = await middleware(request)

      const location = response.headers.get('location')
      if (location) {
        expect(location).not.toContain('/auth')
      }
    })
  })

  describe('Security headers', () => {
    it('should set Content-Security-Policy on normal responses', async () => {
      const request = createRequest('/uk/my-day', makeTokenCookie())
      const response = await middleware(request)

      const csp = response.headers.get('Content-Security-Policy')
      expect(csp).toBeTruthy()
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("frame-ancestors 'none'")
      expect(csp).toContain("object-src 'none'")
    })

    it('should set X-Frame-Options and X-Content-Type-Options', async () => {
      const request = createRequest('/uk/my-day', makeTokenCookie())
      const response = await middleware(request)

      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    })

    it('should set security headers on redirect responses', async () => {
      const request = createRequest('/uk/my-day') // no token → redirect
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain('/auth')
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy()
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
    })
  })

  describe('Callback route', () => {
    it('should pass through /callback without locale redirect', async () => {
      const request = createRequest('/callback?code=abc&state=xyz')
      const response = await middleware(request)

      const location = response.headers.get('location')
      expect(location).toBeNull()
    })
  })

  describe('API routes', () => {
    it('should reject oversized API requests before they reach the handler', async () => {
      const request = createRequest('/api/test', undefined, {
        method: 'POST',
        headers: new Headers({
          'content-length': '1000001',
        }),
      })
      const response = await middleware(request)

      expect(response.status).toBe(413)
      expect(await response.text()).toBe('Payload Too Large')
    })

    it('should pass through API routes without locale redirects', async () => {
      const request = createRequest('/api/test')
      const response = await middleware(request)

      expect(response.headers.get('location')).toBeNull()
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy()
    })
  })

  describe('Middleware matcher', () => {
    it('should cover app pages and API routes', () => {
      expect(config.matcher).toEqual(['/api/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'])
    })
  })
})
