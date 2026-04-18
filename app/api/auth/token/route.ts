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

/** GET — Retrieve tokens from httpOnly cookie (refreshToken is never exposed to JS) */
export async function GET(): Promise<NextResponse> {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE)

  if (!tokenCookie?.value) {
    return NextResponse.json(null, { status: 401 })
  }

  try {
    const tokens = JSON.parse(tokenCookie.value)
    const { refreshToken, ...safeTokens } = tokens
    return NextResponse.json({ ...safeTokens, hasRefreshToken: !!refreshToken })
  } catch {
    return NextResponse.json(null, { status: 401 })
  }
}

/** POST — Store tokens in httpOnly cookie */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let tokens: Record<string, unknown>
  try {
    tokens = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!tokens?.accessToken || !tokens?.idToken || typeof tokens.expiresAt !== 'number') {
    return NextResponse.json({ error: 'Invalid tokens' }, { status: 400 })
  }

  // Preserve refreshToken from existing cookie when the incoming payload omits it
  // (e.g. handleCallback adds userRole after exchange route already stored the full tokens)
  let mergedTokens = tokens
  if (!tokens.refreshToken) {
    const cookieStore = cookies()
    const existing = cookieStore.get(AUTH_TOKEN_COOKIE)
    if (existing?.value) {
      try {
        const stored = JSON.parse(existing.value)
        if (stored?.refreshToken) {
          mergedTokens = { ...tokens, refreshToken: stored.refreshToken }
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  const serialized = JSON.stringify(mergedTokens)
  if (serialized.length > 3900) {
    return NextResponse.json({ error: 'Token payload too large for cookie storage' }, { status: 413 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_TOKEN_COOKIE, JSON.stringify(mergedTokens), {
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
