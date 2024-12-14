import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { CustomSession } from '@/types/auth'

import { Roles } from './types/security'

export async function middleware(request: NextRequest) {
  const session = (await auth()) as CustomSession

  const protectedRoutes = {
    ADMIN: request.nextUrl.pathname.includes(Routes.ADMIN),
    PROFILE: request.nextUrl.pathname.includes(Routes.PROFILE),
  }

  if (!session?.user && (protectedRoutes.ADMIN || protectedRoutes.PROFILE)) {
    return NextResponse.redirect(new URL(Routes.SIGNIN, request.url))
  }

  if (session?.user && request.nextUrl.pathname.includes(Routes.SIGNIN)) {
    return NextResponse.redirect(new URL(Routes.PROFILE, request.url))
  }

  if (session?.user?.role !== Roles.ADMIN && protectedRoutes.ADMIN) {
    return NextResponse.redirect(new URL(Routes.PROFILE, request.url))
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: [
    '/',

    '/admin',
    '/profile',
    '/signin',
    '/cart',
    '/delivery-details',
    '/payment-info',
    '/review',

    '/(en|uk|pl)',
    '/(en|uk|pl)/admin',
    '/(en|uk|pl)/signin',
    '/(en|uk|pl)/profile',
    '/(en|uk|pl)/cart',
    '/(en|uk|pl)/delivery-details',
    '/(en|uk|pl)/payment-info',
    '/(en|uk|pl)/review',
  ],
}
