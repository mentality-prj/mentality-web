import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'

import { routing } from './i18n/routing'

export async function middleware(request: NextRequest) {
  const data = await auth()

  if (!data?.user && request.nextUrl.pathname.startsWith('/profile')) {
    console.log('error midlleware')
    return Response.redirect(new URL('/signin', request.url))
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/signin',
    '/cart',
    '/delivery-details',
    '/(en|uk|pl)',
    '/(en|uk|pl)/signin',
    '/(en|uk|pl)/profile',
    '/(en|uk|pl)/cart',
    '/(en|uk|pl)/delivery-details',
  ],
}
