import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'

import { Routes } from './constants/routes'
import { routing } from './i18n/routing'
import { CustomSession } from './types/auth'

export async function middleware(request: NextRequest) {
  const data = (await auth()) as CustomSession

  if (!data?.user && request.nextUrl.pathname.includes(Routes.PROFILE)) {
    return Response.redirect(new URL(Routes.SIGNIN, request.url))
  }

  if (data?.user && request.nextUrl.pathname.includes(Routes.SIGNIN)) {
    return Response.redirect(new URL(Routes.PROFILE, request.url))
  }

  return createMiddleware(routing)(request)
}

// debt: replace hardcoded strings with named constants
export const config = {
  matcher: ['/', '/profile', '/signin', '/(en|uk|pl)', '/(en|uk|pl)/signin', '/(en|uk|pl)/profile'],
}
