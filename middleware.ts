import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { Routes } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { AuthTokens } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Roles } from '@/types/security'

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
  const zitadelIssuer = process.env.NEXT_PUBLIC_AUTH_ISSUER ?? process.env.NEXT_PUBLIC_ZITADEL_ISSUER ?? ''
  let zitadelConnectSrc = ''
  if (zitadelIssuer) {
    try {
      zitadelConnectSrc = ` ${new URL(zitadelIssuer).origin}`
    } catch {
      zitadelConnectSrc = ''
    }
  }
  const isProduction = process.env.NODE_ENV === 'production'
  return [
    "default-src 'self'",
    isProduction
      ? "script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://res.cloudinary.com https://images.pexels.com https://fakestoreapi.com https://via.placeholder.com",
    `connect-src 'self'${connectSrcExtra}${zitadelConnectSrc} https://www.google.com/recaptcha/${isProduction ? '' : ' ws:'}`,
    // fonts.gstatic.com serves the actual font binary files
    "font-src 'self' https://fonts.gstatic.com",
    // style-src-attr must be set explicitly because Chrome 94+ treats it as a
    // separate directive from style-src. Radix UI and floating-ui position their
    // portal elements using element.style.setProperty() (inline style attributes
    // set via JavaScript). Without this directive the positioning styles are
    // blocked in Chromium browsers, causing dropdowns/popovers to not open.
    "style-src-attr 'unsafe-inline'",
    'frame-src https://www.google.com/recaptcha/',
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

  // Skip locale handling for /callback — it's a non-locale route
  if (pathname.startsWith('/callback')) {
    return applySecurityHeaders(NextResponse.next())
  }

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
  // Skip /callback and /api routes — they don't use locale prefix
  if (!localeInUrl && !pathname.startsWith('/callback') && !pathname.startsWith('/api')) {
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

  // Auth logic — check for auth token cookie
  const tokenCookie = request.cookies.get(AUTH_TOKEN_COOKIE)?.value
  let authTokens: AuthTokens | null = null
  if (tokenCookie) {
    try {
      authTokens = JSON.parse(tokenCookie) as AuthTokens
    } catch {
      authTokens = null
    }
  }
  const isAuthenticated = !!authTokens?.accessToken

  const publicRoutes = [
    Routes.AUTH,
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

  // Check if token is expired — redirect to signin to re-authenticate
  if (isAuthenticated && authTokens && !isServerErrorPage) {
    const isExpired = authTokens.expiresAt < Math.floor(Date.now() / 1000)
    if (isExpired && !authTokens.refreshToken) {
      // Token expired and no refresh token — clear cookie and redirect to signin
      const response = NextResponse.redirect(new URL(`/${locale}${Routes.AUTH}`, request.url))
      response.cookies.delete(AUTH_TOKEN_COOKIE)
      return applySecurityHeaders(response)
    }
  }

  if (!isAuthenticated && isProtectedPath) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}${Routes.AUTH}`, request.url)))
  }

  // If the user is already authenticated, don't show the auth page —
  // redirect them to their main My-day page instead.
  if (isAuthenticated && normalizedPath === Routes.AUTH) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}${Routes.MYDAY}`, request.url)))
  }

  // Role-based access: non-admin users cannot access admin routes
  if (authTokens?.userRole !== Roles.ADMIN && protectedRoutes.ADMIN) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}${Routes.PROFILE}`, request.url)))
  }

  applySecurityHeaders(intlResponse)
  return intlResponse
}

export const config = {
  matcher: ['/', '/(en|uk|pl)/:path*', '/callback'],
}
