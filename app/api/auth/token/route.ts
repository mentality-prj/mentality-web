import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** GET — Retrieve tokens from httpOnly cookie */
export async function GET(): Promise<NextResponse> {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE)

  if (!tokenCookie?.value) {
    return NextResponse.json(null, { status: 401 })
  }

  try {
    const tokens = JSON.parse(tokenCookie.value)
    return NextResponse.json(tokens)
  } catch {
    return NextResponse.json(null, { status: 401 })
  }
}

/** POST — Store tokens in httpOnly cookie */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const tokens = await request.json()

  if (!tokens?.accessToken || !tokens?.idToken) {
    return NextResponse.json({ error: 'Invalid tokens' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_TOKEN_COOKIE, JSON.stringify(tokens), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  })

  return response
}

/** DELETE — Clear token cookie */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
