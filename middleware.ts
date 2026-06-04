import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { Routes } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { parseStoredAuthTokensCookie } from '@/lib/auth/storedTokens'
import { APIUrl } from '@/requests/config'
import type { AuthTokens } from '@/types/auth'
import type { SupportedLanguage } from '@/types/languages'

const LOCALE_COOKIE = 'NEXT_LOCALE'
const LOCALE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days to align with session duration
const DEFAULT_MAX_REQUEST_BODY_SIZE = 1_000_000

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
const parsedMaxRequestBodySize = Number(process.env.MAX_REQUEST_BODY_SIZE ?? DEFAULT_MAX_REQUEST_BODY_SIZE)
const MAX_REQUEST_BODY_SIZE =
  Number.isFinite(parsedMaxRequestBodySize) && parsedMaxRequestBodySize > 0
    ? Math.floor(parsedMaxRequestBodySize)
    : DEFAULT_MAX_REQUEST_BODY_SIZE

function buildCspHeader(): string {
  const apiUrl = APIUrl.trim()
  // Use only the origin (scheme + host + port) from the shared backend base URL.
  // If we put a full URL with a path here, CSP would match only that exact path
  // and could block other upstream backend endpoints on the same host.
  // Internal Next.js routes are already covered by 'self'.
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
  const zitadelIssuer = (process.env.NEXT_PUBLIC_AUTH_ISSUER ?? process.env.NEXT_PUBLIC_ZITADEL_ISSUER ?? '').trim()
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

function mergeOverrideHeaders(existing: string | null, additions: string[]): string {
  const values = new Set(
    (existing ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )

  additions.forEach((value) => values.add(value))

  return Array.from(values).join(',')
}

function applyRequestContextHeaders(response: NextResponse, pathname: string, requestId: string): NextResponse {
  response.headers.set(
    'x-middleware-override-headers',
    mergeOverrideHeaders(response.headers.get('x-middleware-override-headers'), ['x-pathname', 'x-request-id'])
  )
  response.headers.set('x-middleware-request-x-pathname', pathname)
  response.headers.set('x-middleware-request-x-request-id', requestId)

  return response
}

async function refreshTokensServerSide(
  currentTokens: AuthTokens,
  requestUrl: string,
  cookieHeader: string
): Promise<{ tokens: AuthTokens; setCookieHeader: string | null } | null> {
  if (!currentTokens.refreshToken) return null

  try {
    // Call the internal exchange route which holds the client secret server-side.
    // Forward the cookie header so the route can read the refresh token from it.
    const baseUrl = new URL(requestUrl).origin
    const response = await fetch(`${baseUrl}/api/auth/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ grantType: 'refresh_token' }),
    })

    if (!response.ok) return null

    const data = await response.json()
    // Forward the Set-Cookie header from exchange route so refresh token rotation is preserved
    const setCookieHeader = response.headers.get('set-cookie')
    return {
      tokens: {
        accessToken: data.access_token,
        idToken: data.id_token ?? currentTokens.idToken,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
        userRole: currentTokens.userRole,
      },
      setCookieHeader,
    }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestId = crypto.randomUUID()
  const isApiRoute = pathname === '/api' || pathname.startsWith('/api/')
  const isCallbackRoute = pathname === '/callback'
  // Protect mutating endpoints from excessively large request bodies by
  // checking Content-Length header early in middleware and returning 413.
  try {
    const method = (request.method || 'GET').toUpperCase()
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const contentLength = request.headers.get('content-length')
      if (contentLength) {
        const len = parseInt(contentLength, 10)
        if (!Number.isNaN(len) && len > MAX_REQUEST_BODY_SIZE) {
          return applySecurityHeaders(new NextResponse('Payload Too Large', { status: 413 }))
        }
      }
    }
  } catch {
    // If anything goes wrong reading headers, continue and handle later.
  }
  const segments = pathname.split('/')
  const localeInUrl = segments[1] && routing.locales.includes(segments[1] as SupportedLanguage) ? segments[1] : null

  // Skip locale handling for /callback — it's a non-locale route
  if (isCallbackRoute) {
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
  if (!localeInUrl && !isCallbackRoute && !isApiRoute) {
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

  if (isApiRoute) {
    return applySecurityHeaders(NextResponse.next())
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
  const authTokens: AuthTokens | null = parseStoredAuthTokensCookie(tokenCookie)
  const isAuthenticated = !!authTokens

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

  // Check if token is expired
  if (isAuthenticated && authTokens && !isServerErrorPage) {
    const isExpired = authTokens.expiresAt < Math.floor(Date.now() / 1000)
    if (isExpired && !authTokens.refreshToken) {
      // Token expired and no refresh token — clear cookie and redirect to auth
      const response = NextResponse.redirect(new URL(`/${locale}${Routes.AUTH}`, request.url))
      response.cookies.delete(AUTH_TOKEN_COOKIE)
      return applySecurityHeaders(response)
    }

    if (isExpired && authTokens.refreshToken) {
      // Token expired but refresh token exists — try server-side refresh
      const cookieHeader = request.headers.get('cookie') ?? ''
      const refreshResult = await refreshTokensServerSide(authTokens, request.url, cookieHeader)
      if (refreshResult) {
        // Redirect to the same URL so the refreshed cookie is visible to
        // Server Components / Route Handlers on the next request.
        const redirectResponse = NextResponse.redirect(request.url)
        // Forward the Set-Cookie from exchange route (contains refreshToken)
        if (refreshResult.setCookieHeader) {
          redirectResponse.headers.set('set-cookie', refreshResult.setCookieHeader)
        }
        return applySecurityHeaders(redirectResponse)
      } else {
        // Refresh failed — clear cookie and redirect to auth
        const response = NextResponse.redirect(new URL(`/${locale}${Routes.AUTH}`, request.url))
        response.cookies.delete(AUTH_TOKEN_COOKIE)
        return applySecurityHeaders(response)
      }
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

  // Note: role-based access control (e.g. admin routes) is handled server-side
  // in the respective layout.tsx files via getServerSession(), NOT in middleware,
  // because the cookie-stored userRole is client-controlled and unverifiable here.

  applyRequestContextHeaders(intlResponse, pathname, requestId)
  applySecurityHeaders(intlResponse)
  return intlResponse
}

export const config = {
  matcher: ['/api/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
