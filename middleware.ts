import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { CustomSession } from '@/types/auth'

import { Roles } from './types/security'

export async function middleware(request: NextRequest) {
  const session = (await auth()) as CustomSession
  const publicRoutes = [Routes.SIGNIN, Routes.MAIN]

  const { pathname } = request.nextUrl
  const segments = pathname.split('/')
  const locale = segments[1] || 'en'

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

  if (session?.user?.role !== Roles.ADMIN && protectedRoutes.ADMIN) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.PROFILE}`, request.url))
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: ['/', '/(en|uk|pl)/:path*'],
}
