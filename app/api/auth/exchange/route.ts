import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'

/** POST — Exchange authorization code for tokens (server-side to keep client_secret safe) */
export async function POST(request: NextRequest) {
  const ZITADEL_ISSUER = process.env.NEXT_PUBLIC_ZITADEL_ISSUER
  const CLIENT_ID = process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID ?? process.env.ZITADEL_CLIENT_ID
  const CLIENT_SECRET = process.env.ZITADEL_CLIENT_SECRET
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/callback`

  if (!ZITADEL_ISSUER || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI.startsWith('http')) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing Zitadel environment variables' },
      { status: 500 }
    )
  }

  // CSRF: reject cross-origin browser requests (server-to-server calls like middleware won't send Origin)
  const origin = request.headers.get('origin')
  if (origin) {
    const host = request.headers.get('host')
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }
  try {
    const body = await request.json()
    const { code, codeVerifier, grantType } = body as {
      code?: string
      codeVerifier?: string
      grantType: 'authorization_code' | 'refresh_token'
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    })

    if (grantType === 'authorization_code') {
      if (!code || !codeVerifier) {
        return NextResponse.json({ error: 'Missing code or codeVerifier' }, { status: 400 })
      }
      params.set('grant_type', 'authorization_code')
      params.set('code', code)
      params.set('code_verifier', codeVerifier)
      params.set('redirect_uri', REDIRECT_URI)
    } else if (grantType === 'refresh_token') {
      // Read refresh token from httpOnly cookie (never sent from client JS)
      const cookieStore = cookies()
      const tokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE)
      let refreshToken: string | undefined
      try {
        const stored = JSON.parse(tokenCookie?.value ?? '')
        refreshToken = stored?.refreshToken
      } catch {
        // ignore parse errors
      }
      if (!refreshToken) {
        return NextResponse.json({ error: 'No refresh token available' }, { status: 400 })
      }
      params.set('grant_type', 'refresh_token')
      params.set('refresh_token', refreshToken)
    } else {
      return NextResponse.json({ error: 'Invalid grantType' }, { status: 400 })
    }

    const tokenResponse = await fetch(`${ZITADEL_ISSUER}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    const data = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json(data, { status: tokenResponse.status })
    }

    // For refresh_token grants, update the cookie server-side to preserve the refresh token
    if (grantType === 'refresh_token') {
      const cookieStore = cookies()
      const existing = cookieStore.get(AUTH_TOKEN_COOKIE)
      let storedTokens: Record<string, unknown> = {}
      try {
        storedTokens = JSON.parse(existing?.value ?? '{}')
      } catch {
        // ignore
      }

      const updatedTokens = {
        ...storedTokens,
        accessToken: data.access_token,
        idToken: data.id_token ?? storedTokens.idToken,
        refreshToken: data.refresh_token ?? storedTokens.refreshToken,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      }

      const serialized = JSON.stringify(updatedTokens)
      if (serialized.length > 3900) {
        return NextResponse.json({ error: 'Token payload too large for cookie storage' }, { status: 413 })
      }

      const safeData = { ...data }
      delete safeData.refresh_token
      const resp = NextResponse.json(safeData)
      resp.cookies.set(AUTH_TOKEN_COOKIE, serialized, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: AUTH_COOKIE_MAX_AGE,
      })
      return resp
    }

    // For authorization_code grants, store all tokens (incl. refresh) in httpOnly cookie
    // and return only client-safe fields (no refresh_token)
    const cookieTokens = {
      accessToken: data.access_token,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
    }

    const serialized = JSON.stringify(cookieTokens)
    if (serialized.length > 3900) {
      return NextResponse.json({ error: 'Token payload too large for cookie storage' }, { status: 413 })
    }

    const safeData = { ...data }
    delete safeData.refresh_token
    const resp = NextResponse.json(safeData)
    resp.cookies.set(AUTH_TOKEN_COOKIE, serialized, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_COOKIE_MAX_AGE,
    })
    return resp
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
