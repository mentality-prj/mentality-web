import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { CustomSession } from '@/types/auth'

import { Roles } from './types/security'

export async function middleware(request: NextRequest) {
  const session = (await auth()) as CustomSession
  const allowedEmails = process.env.ALLOWED_EMAILS
    ? process.env.ALLOWED_EMAILS.split(',').map((email) => email.trim())
    : []
  const publicRoutes = [Routes.SIGNIN, Routes.MAIN]

  const protectedRoutes = Object.fromEntries(
    Object.entries(Routes)
      .filter(([, path]) => !publicRoutes.includes(path))
      .map(([key, path]) => [key, request.nextUrl.pathname.includes(path)])
  )

  const isProtectedPath = Object.values(protectedRoutes).some(Boolean)

  if (!session?.user && isProtectedPath) {
    return NextResponse.redirect(new URL(Routes.SIGNIN, request.url))
  }

  if (session?.user?.email && !allowedEmails.includes(session.user.email) && isProtectedPath) {
    return NextResponse.redirect(new URL(Routes.MAIN, request.url))
  }

  if (
    session?.user?.email &&
    allowedEmails.includes(session.user.email) &&
    request.nextUrl.pathname.includes(Routes.SIGNIN)
  ) {
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
    '/(en|uk|pl)',
    '/admin',
    '/(en|uk|pl)/admin',
    '/affirmations',
    '/(en|uk|pl)/affirmations',
    '/ai-assistant',
    '/(en|uk|pl)/ai-assistant',
    '/articles',
    '/(en|uk|pl)/articles',
    '/shop/delivery-details',
    '/(en|uk|pl)/shop/delivery-details',
    '/home',
    '/(en|uk|pl)/home',
    '/shop/cart',
    '/(en|uk|pl)/shop/cart',
    '/mood-tracker',
    '/(en|uk|pl)/mood-tracker',
    '/my-notes',
    '/(en|uk|pl)/my-notes',
    '/my-progress',
    '/(en|uk|pl)/my-progress',
    '/shop/payment-info',
    '/(en|uk|pl)/shop/payment-info',
    '/profile',
    '/(en|uk|pl)/profile',
    '/reminder',
    '/(en|uk|pl)/reminder',
    '/shop/review',
    '/(en|uk|pl)/shop/review',
    '/settings',
    '/(en|uk|pl)/settings',
    '/shop',
    '/(en|uk|pl)/shop',
    '/signin',
    '/(en|uk|pl)/signin',
    '/support',
    '/(en|uk|pl)/support',
    '/tips',
    '/(en|uk|pl)/tips',
    '/thanks',
    '/(en|uk|pl)/thanks',
  ],
}
