import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { CustomSession } from '@/types/auth'

import { Roles } from './types/security'

export async function middleware(request: NextRequest) {
  const session = (await auth()) as CustomSession
  // const allowedEmails = process.env.ALLOWED_EMAILS
  //   ? process.env.ALLOWED_EMAILS.split(',').map((email) => email.trim())
  //   : []
  const publicRoutes = [Routes.SIGNIN, Routes.MAIN]
  const { pathname } = request.nextUrl
  const segments = pathname.split('/')
  const locale = segments[1] || 'en'

  const protectedRoutes = Object.fromEntries(
    Object.entries(Routes)
      .filter(([, path]) => !publicRoutes.includes(path))
      .map(([key, path]) => [key, request.nextUrl.pathname.includes(path)])
  )

  const isProtectedPath = Object.values(protectedRoutes).some(Boolean)

  if (!session?.user && isProtectedPath) {
    return NextResponse.redirect(new URL(`/${locale}${Routes.SIGNIN}`, request.url))
  }

  if (session?.user?.email || pathname === '/' || pathname === `/${locale}`) {
    const isSignin = pathname.includes(Routes.SIGNIN)
    const isMain = pathname === '/' || pathname === `/${locale}`
    const isHome = pathname === `/${locale}${Routes.HOME}`

    if ((session?.user?.email && isSignin) || isMain) {
      if (!isHome) {
        return NextResponse.redirect(new URL(`/${locale}${Routes.HOME}`, request.nextUrl.origin))
      }
    }
  }

  if (session?.user?.role !== Roles.ADMIN && protectedRoutes.ADMIN) {
    return NextResponse.redirect(new URL(Routes.PROFILE, request.url))
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: ['/', '/(en|uk|pl)/:path*'],
}
