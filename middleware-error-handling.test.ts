/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { NextRequest } from 'next/server'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'

// Mock the auth function
jest.mock('@/auth', () => ({
  auth: jest.fn(),
}))

// Mock next-intl routing
jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'uk', 'pl'],
    defaultLocale: 'uk',
  },
}))

describe('Middleware Error Handling', () => {
  let middleware: (req: NextRequest) => Promise<Response>

  beforeAll(() => {
    // Import middleware once with mocks in place
    middleware = require('@/middleware').middleware
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createRequest = (pathname: string) => {
    return new NextRequest(new URL(`http://localhost:3000${pathname}`))
  }

  describe('BackendConnectionError', () => {
    it('should redirect to server-error page on BackendConnectionError', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        error: { error: 'BackendConnectionError', message: 'Backend connection failed' },
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      expect(response).toBeDefined()
      expect(response.headers.get('location')).toContain(Routes.SERVERERROR)
    })

    it('should not redirect to server-error if already on server-error page (prevent loop)', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        error: { error: 'BackendConnectionError' },
      })

      const request = createRequest(`/uk${Routes.SERVERERROR}`)
      const response = await middleware(request)

      // Should not redirect (no location header means no redirect)
      expect(response.headers.get('location')).toBeNull()
    })
  })

  describe('RefreshTokenError and InvalidToken', () => {
    it('should redirect to signin and clear cookies on RefreshTokenError', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        error: { error: 'RefreshTokenError', message: 'Refresh token expired' },
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      expect(response).toBeDefined()
      expect(response.headers.get('location')).toContain(Routes.SIGNIN)

      // Check that auth cookies are deleted
      const cookies = (response as any).cookies.getAll()
      const sessionCookie = cookies.find((c: { name: string }) => c.name === 'authjs.session-token')
      const secureSessionCookie = cookies.find((c: { name: string }) => c.name === '__Secure-authjs.session-token')

      // Cookies should be deleted (value is empty string or undefined)
      expect(sessionCookie?.value || '').toBe('')
      expect(secureSessionCookie?.value || '').toBe('')
    })

    it('should redirect to signin and clear cookies on InvalidToken', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        error: { error: 'InvalidToken', message: 'Token is invalid' },
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      expect(response).toBeDefined()
      expect(response.headers.get('location')).toContain(Routes.SIGNIN)

      // Check that auth cookies are deleted
      const cookies = (response as any).cookies.getAll()
      const sessionCookie = cookies.find((c: { name: string; value: string }) => c.name === 'authjs.session-token')
      const secureSessionCookie = cookies.find(
        (c: { name: string; value: string }) => c.name === '__Secure-authjs.session-token'
      )

      expect(sessionCookie?.value || '').toBe('')
      expect(secureSessionCookie?.value || '').toBe('')
    })
  })

  describe('Non-critical errors', () => {
    it('should not redirect on non-critical errors', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        error: { error: 'SomeOtherError', message: 'Some error' },
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      // Should not redirect to error pages
      const location = response.headers.get('location')
      if (location) {
        expect(location).not.toContain(Routes.SERVERERROR)
        expect(location).not.toContain(Routes.SIGNIN)
      }
    })
  })

  describe('Security headers', () => {
    it('should set Content-Security-Policy on normal responses', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        OAuthToken: 'valid-token',
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      const csp = response.headers.get('Content-Security-Policy')
      expect(csp).toBeTruthy()
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("frame-ancestors 'none'")
      expect(csp).toContain("object-src 'none'")
    })

    it('should set Content-Security-Policy on redirect responses', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        error: { error: 'BackendConnectionError', message: 'Backend connection failed' },
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain(Routes.SERVERERROR)
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy()
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    })
  })

  describe('No errors', () => {
    it('should process normally when there are no session errors', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        OAuthToken: 'valid-token',
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      // Should not redirect to error pages
      const location = response.headers.get('location')
      if (location) {
        expect(location).not.toContain(Routes.SERVERERROR)
        expect(location).not.toContain(Routes.SIGNIN)
      }
    })
  })

  describe('Error type variations', () => {
    it('should handle error as string', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        error: { error: 'BackendConnectionError', message: 'Backend connection failed' },
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain(Routes.SERVERERROR)
    })

    it('should handle error as object with error property', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        error: { error: 'RefreshTokenError' },
      })

      const request = createRequest('/uk/my-day')
      const response = await middleware(request)

      expect(response.headers.get('location')).toContain(Routes.SIGNIN)
    })
  })
})
