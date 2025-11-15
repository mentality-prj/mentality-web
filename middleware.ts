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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
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
  const publicRoutes = [Routes.SIGNIN, Routes.MAIN]

  // Use locale from URL or default if not set
  const locale = localeInUrl || routing.defaultLocale

  const normalizedPath = pathname.replace(/^\/(en|uk|pl)(?=\/|$)/, '') || '/'

  const protectedRoutes = Object.fromEntries(
    Object.entries(Routes)
      .filter(([, path]) => !publicRoutes.includes(path))
      .map(([key, path]) => [key, normalizedPath === path || normalizedPath.startsWith(path + '/')])
  )

  const isProtectedPath = Object.values(protectedRoutes).some(Boolean)

  if (!session?.user && isProtectedPath) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.SIGNIN}`, request.url))
  }

  if (session?.user?.email) {
    const isSignin = normalizedPath === Routes.SIGNIN
    const isMain = normalizedPath === Routes.MAIN
    const isHome = normalizedPath === Routes.HOME

    if (isSignin || isMain) {
      if (!isHome) {
        return NextResponse.redirect(new URL(`/${locale}${Routes.HOME}`, request.nextUrl.origin))
      }
    }
  }

  // Explicit check for locale root page (e.g., /en, /uk, /pl)
  const isLocaleRoot = routing.locales.includes(segments[1] as SupportedLanguage) && segments.length === 2
  if (session?.user?.email && isLocaleRoot) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.HOME}`, request.nextUrl.origin))
  }

  if (session?.user?.role !== Roles.ADMIN && protectedRoutes.ADMIN) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.PROFILE}`, request.url))
  }

  return intlResponse
}

export const config = {
  matcher: ['/', '/(en|uk|pl)/:path*'],
}
