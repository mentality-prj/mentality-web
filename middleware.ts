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
          return new NextResponse('Payload Too Large', { status: 413 })
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
    return response
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
    return response
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
  const publicRoutes = [Routes.SIGNIN, Routes.MAIN, Routes.SERVERERROR]

  // Use locale from URL or default if not set
  const locale = localeInUrl || routing.defaultLocale

  const normalizedPath = pathname.replace(/^\/(en|uk|pl)(?=\/|$)/, '') || '/'

  const protectedRoutes = Object.fromEntries(
    Object.entries(Routes)
      .filter(([, path]) => !publicRoutes.includes(path))
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
        return NextResponse.redirect(new URL(`/${locale}${Routes.SERVERERROR}`, request.url))
      }

      // For other critical errors (InvalidToken, RefreshTokenError), redirect to signin
      const response = NextResponse.redirect(new URL(`/${locale}${Routes.SIGNIN}`, request.url))
      response.cookies.delete('authjs.session-token')
      response.cookies.delete('__Secure-authjs.session-token')
      return response
    }
  }

  if (!session?.user && isProtectedPath) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.SIGNIN}`, request.url))
  }

  // If the user is already authenticated, don't show the signin page —
  // redirect them to their main My-day page instead.
  if (session?.user && normalizedPath === Routes.SIGNIN) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.MYDAY}`, request.url))
  }

  if (session?.user?.role !== Roles.ADMIN && protectedRoutes.ADMIN) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.PROFILE}`, request.url))
  }

  return intlResponse
}

export const config = {
  matcher: ['/', '/(en|uk|pl)/:path*'],
}
