import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { SupportedLanguage } from '@/types/languages'

import { Roles } from './types/security'

const LOCALE_COOKIE = 'NEXT_LOCALE'
const LOCALE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days to align with session duration

function getPreferredLocale(request: NextRequest): SupportedLanguage {
  // 1. Check cookie for saved locale
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && routing.locales.includes(cookieLocale as SupportedLanguage)) {
    return cookieLocale as SupportedLanguage
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Extract language codes from Accept-Language (e.g., 'en-US' → 'en', 'uk' → 'uk')
    const browserLocales = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0])
      .filter((lang) => lang.length > 0) // Filter out empty strings from malformed headers

    // Find first supported locale from browser preferences
    const supportedLocale = browserLocales.find((lang) => routing.locales.includes(lang as SupportedLanguage))
    if (supportedLocale) {
      return supportedLocale as SupportedLanguage
    }
  }

  // 3. Fallback to default locale
  return routing.defaultLocale as SupportedLanguage
}

const intlMiddleware = createMiddleware(routing)

// Maximum allowed request body size in bytes for mutating requests.
// Can be overridden with env var MAX_REQUEST_BODY_SIZE (in bytes).
const MAX_REQUEST_BODY_SIZE = Number(process.env.MAX_REQUEST_BODY_SIZE ?? 1_000_000) // 1 MB default

function buildCspHeader(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  // Use only the origin (scheme + host + port) so that all API sub-paths are
  // allowed. A full URL like https://api.example.com/api would only match the
  // exact path and block /api/moods, /api/user-tags, etc.
  let connectSrcExtra = ''
  if (apiUrl) {
    try {
      connectSrcExtra = ` ${new URL(apiUrl).origin}`
    } catch {
      // If the API URL is malformed, omit it from connect-src rather than
      // interpolating the raw value to avoid breaking or injecting into the CSP.
      connectSrcExtra = ''
    }
  }
  const isProduction = process.env.NODE_ENV === 'production'
  return [
    "default-src 'self'",
    // 'unsafe-inline' is required for Next.js hydration scripts and CSS-in-JS.
    // A nonce-based approach would allow removing it, but Next.js does not yet
    // provide a stable nonce injection mechanism without a custom server setup.
    // 'unsafe-eval' is additionally required in development for webpack HMR/eval.
    isProduction ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    // fonts.googleapis.com hosts the @font-face stylesheet imported in globals.css
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://res.cloudinary.com https://images.pexels.com https://fakestoreapi.com https://via.placeholder.com",
    // In development, Next.js HMR uses a WebSocket connection that must be
    // explicitly allowed; the ws: scheme is separate from https:.
    `connect-src 'self'${connectSrcExtra} https://oauth2.googleapis.com https://accounts.google.com${isProduction ? '' : ' ws:'}`,
    // fonts.gstatic.com serves the actual font binary files
    "font-src 'self' https://fonts.gstatic.com",
    // style-src-attr must be set explicitly because Chrome 94+ treats it as a
    // separate directive from style-src. Radix UI and floating-ui position their
    // portal elements using element.style.setProperty() (inline style attributes
    // set via JavaScript). Without this directive the positioning styles are
    // blocked in Chromium browsers, causing dropdowns/popovers to not open.
    "style-src-attr 'unsafe-inline'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    // Only enforce HTTPS upgrades in production; in development the API URL is
    // typically http://localhost which would be broken by this directive.
    ...(isProduction ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Content-Security-Policy', buildCspHeader())
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Protect mutating endpoints from excessively large request bodies by
  // checking Content-Length header early in middleware and returning 413.
  try {
    const method = (request.method || 'GET').toUpperCase()
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentLength = request.headers.get('content-length')
      if (contentLength) {
        const len = parseInt(contentLength, 10)
        if (!Number.isNaN(len) && len > MAX_REQUEST_BODY_SIZE) {
          return applySecurityHeaders(new NextResponse('Payload Too Large', { status: 413 }))
        }
      }
    }
  } catch (err) {
    // If anything goes wrong reading headers, continue and handle later.
  }
  const segments = pathname.split('/')
  const localeInUrl = segments[1] && routing.locales.includes(segments[1] as SupportedLanguage) ? segments[1] : null

  // Handle root path - redirect to preferred locale
  if (pathname === '/') {
    const preferredLocale = getPreferredLocale(request)
    const url = new URL(`/${preferredLocale}`, request.url)
    const response = NextResponse.redirect(url)
    response.cookies.set(LOCALE_COOKIE, preferredLocale, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return applySecurityHeaders(response)
  }

  // If no locale in URL (but not root), redirect to preferred locale
  if (!localeInUrl) {
    const preferredLocale = getPreferredLocale(request)
    const url = new URL(`/${preferredLocale}${pathname}`, request.url)
    const response = NextResponse.redirect(url)
    response.cookies.set(LOCALE_COOKIE, preferredLocale, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return applySecurityHeaders(response)
  }

  // Run next-intl middleware
  const intlResponse = intlMiddleware(request)

  // Save locale to cookie in response
  if (localeInUrl) {
    intlResponse.cookies.set(LOCALE_COOKIE, localeInUrl, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  }

  // Auth logic
  const session = await auth()
  const publicRoutes = [
    Routes.SIGNIN,
    Routes.MAIN,
    Routes.ABOUT,
    Routes.FAQ,
    Routes.CONTACTS,
    Routes.SERVICES,
    Routes.SERVERERROR,
    Routes.PRIVACY,
    Routes.TERMS,
    Routes.COOKIES,
  ]

  // Use locale from URL or default if not set
  const locale = localeInUrl || routing.defaultLocale

  const normalizedPath = pathname.replace(/^\/(en|uk|pl)(?=\/|$)/, '') || '/'

  const protectedRoutes = Object.fromEntries(
    Object.entries(Routes)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && !publicRoutes.includes(entry[1]))
      .map(([key, path]) => [key, normalizedPath === path || normalizedPath.startsWith(path + '/')])
  )

  const isProtectedPath = Object.values(protectedRoutes).some(Boolean)

  // Skip session error checks for server-error page to avoid redirect loops
  const isServerErrorPage = normalizedPath === Routes.SERVERERROR

  // Check for session errors FIRST - before any other auth logic
  // Only act on session errors when there is a signed-in session. If there's
  // no `session.user`, treat the request as unauthenticated and allow public pages.
  if (session?.error && session.user && !isServerErrorPage) {
    const errorType = typeof session.error === 'string' ? session.error : session.error.error
    const isCriticalError =
      errorType === 'RefreshTokenError' || errorType === 'BackendConnectionError' || errorType === 'InvalidToken'

    // If there's a critical error, handle it appropriately
    if (isCriticalError) {
      // For BackendConnectionError, redirect to server-error page
      if (errorType === 'BackendConnectionError') {
        return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}${Routes.SERVERERROR}`, request.url)))
      }

      // For other critical errors (InvalidToken, RefreshTokenError), redirect to signin
      const response = NextResponse.redirect(new URL(`/${locale}${Routes.SIGNIN}`, request.url))
      response.cookies.delete('authjs.session-token')
      response.cookies.delete('__Secure-authjs.session-token')
      return applySecurityHeaders(response)
    }
  }

  if (!session?.user && isProtectedPath) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}${Routes.SIGNIN}`, request.url)))
  }

  // If the user is already authenticated, don't show the signin page —
  // redirect them to their main My-day page instead.
  if (session?.user && normalizedPath === Routes.SIGNIN) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}${Routes.MYDAY}`, request.url)))
  }

  if (session?.user?.role !== Roles.ADMIN && protectedRoutes.ADMIN) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}${Routes.PROFILE}`, request.url)))
  }

  applySecurityHeaders(intlResponse)
  return intlResponse
}

export const config = {
  matcher: ['/((?!_next|api|favicons|avatars|icons|images|services|.*\\..*).*)'],
}
