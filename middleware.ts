import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { Roles } from '@/constants/security'
import { routing } from '@/i18n/routing'
import { CustomSession } from '@/types/auth'

export async function middleware(request: NextRequest) {
  const data = (await auth()) as CustomSession

  if (!data?.user && request.nextUrl.pathname.includes(Routes.PROFILE)) {
    return NextResponse.redirect(new URL(Routes.SIGNIN, request.url))
  }

  if (data?.user && request.nextUrl.pathname.includes(Routes.SIGNIN)) {
    return NextResponse.redirect(new URL(Routes.PROFILE, request.url))
  }

  if (data?.user?.role !== Roles.ADMIN && request.nextUrl.pathname.includes(Routes.ADMIN)) {
    return NextResponse.redirect(new URL(Routes.PROFILE, request.url))
  }

  return createMiddleware(routing)(request)
}

// debt: replace hardcoded strings with named constants
export const config = {
  matcher: ['/', '/profile', '/signin', '/(en|uk|pl)', '/(en|uk|pl)/signin', '/(en|uk|pl)/profile'],
}
