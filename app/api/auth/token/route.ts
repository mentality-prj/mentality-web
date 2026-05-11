import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { normalizeStoredAuthTokens, parseStoredAuthTokensCookie } from '@/lib/auth/storedTokens'

function jsonNoStore(body: unknown, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(body, init)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set(AUTH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).origin === request.nextUrl.origin
  } catch {
    return false
  }
}

/** GET — Retrieve tokens from httpOnly cookie (refreshToken is never exposed to JS) */
export async function GET(): Promise<NextResponse> {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE)

  if (!tokenCookie?.value) {
    return jsonNoStore(null, { status: 401 })
  }

  const tokens = parseStoredAuthTokensCookie(tokenCookie.value)
  if (!tokens) {
    return clearAuthCookie(jsonNoStore(null, { status: 401 }))
  }

  const { refreshToken, ...safeTokens } = tokens
  return jsonNoStore({ ...safeTokens, hasRefreshToken: !!refreshToken })
}

/** POST — Store tokens in httpOnly cookie */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSameOrigin(request)) {
    return jsonNoStore({ error: 'Forbidden' }, { status: 403 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonNoStore({ error: 'Invalid JSON' }, { status: 400 })
  }

  const normalizedTokens = normalizeStoredAuthTokens(payload)
  if (!normalizedTokens) {
    return jsonNoStore({ error: 'Invalid tokens' }, { status: 400 })
  }

  const clientSafeTokens: typeof normalizedTokens = { ...normalizedTokens }
  delete clientSafeTokens.refreshToken

  // Ignore refreshToken from request payload and preserve only the server-managed
  // refreshToken from the existing httpOnly cookie when it is available.
  let mergedTokens: typeof normalizedTokens = clientSafeTokens
  {
    const cookieStore = cookies()
    const existing = cookieStore.get(AUTH_TOKEN_COOKIE)
    const stored = parseStoredAuthTokensCookie(existing?.value)
    if (stored?.refreshToken) {
      mergedTokens = { ...clientSafeTokens, refreshToken: stored.refreshToken }
    }
  }

  const serialized = JSON.stringify(mergedTokens)
  if (serialized.length > 3900) {
    return jsonNoStore({ error: 'Token payload too large for cookie storage' }, { status: 413 })
  }

  const response = jsonNoStore({ ok: true })
  response.cookies.set(AUTH_TOKEN_COOKIE, serialized, {
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
    return jsonNoStore({ error: 'Forbidden' }, { status: 403 })
  }

  return clearAuthCookie(jsonNoStore({ ok: true }))
}
