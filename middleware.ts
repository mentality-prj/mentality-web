import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'

import { routing } from './i18n/routing'

export async function middleware(request: NextRequest) {
  const data = await auth()

  if (!data?.user && request.nextUrl.pathname.startsWith('/profile')) {
    return Response.redirect(new URL('/signin', request.url)) // Перенаправляємо на сторінку авторизації
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: ['/', '/(en|id)', '/profile', '/signin'],
}
