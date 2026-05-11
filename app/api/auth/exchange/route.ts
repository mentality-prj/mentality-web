import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { parseStoredAuthTokensCookie, type StoredAuthTokens } from '@/lib/auth/storedTokens'

type TokenEndpointResponse = {
  access_token: string
  id_token?: string
  refresh_token?: string
  expires_in: number
}

function jsonNoStore(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

function isSameOriginOrServerRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) {
    return true
  }

  try {
    return new URL(origin).origin === request.nextUrl.origin
  } catch {
    return false
  }
}

function normalizeTokenEndpointResponse(payload: unknown): TokenEndpointResponse | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const record = payload as Record<string, unknown>
  const accessToken = typeof record.access_token === 'string' ? record.access_token.trim() : ''
  const expiresIn = typeof record.expires_in === 'number' ? record.expires_in : Number.NaN

  if (!accessToken || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    return null
  }

  const normalized: TokenEndpointResponse = {
    access_token: accessToken,
    expires_in: Math.floor(expiresIn),
  }

  if (typeof record.id_token === 'string' && record.id_token.trim()) {
    normalized.id_token = record.id_token.trim()
  }

  if (typeof record.refresh_token === 'string' && record.refresh_token.trim()) {
    normalized.refresh_token = record.refresh_token.trim()
  }

  return normalized
}

async function readJsonPayload(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function setAuthCookie(response: NextResponse, serializedTokens: string): NextResponse {
  response.cookies.set(AUTH_TOKEN_COOKIE, serializedTokens, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  })
  return response
}

/** POST — Exchange authorization code for tokens (server-side to keep client_secret safe) */
export async function POST(request: NextRequest) {
  const ZITADEL_ISSUER = process.env.NEXT_PUBLIC_ZITADEL_ISSUER
  const CLIENT_ID = process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID ?? process.env.ZITADEL_CLIENT_ID
  const CLIENT_SECRET = process.env.ZITADEL_CLIENT_SECRET
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/callback`

  if (!ZITADEL_ISSUER || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI.startsWith('http')) {
    return jsonNoStore({ error: 'Server misconfiguration: missing Zitadel environment variables' }, { status: 500 })
  }

  // CSRF: reject cross-origin browser requests (server-to-server calls like middleware won't send Origin)
  if (!isSameOriginOrServerRequest(request)) {
    return jsonNoStore({ error: 'Forbidden' }, { status: 403 })
  }

  let body: {
    code?: string
    codeVerifier?: string
    grantType?: 'authorization_code' | 'refresh_token'
  }

  try {
    body = (await request.json()) as {
      code?: string
      codeVerifier?: string
      grantType?: 'authorization_code' | 'refresh_token'
    }
  } catch {
    return jsonNoStore({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    const { code, codeVerifier, grantType } = body as {
      code?: string
      codeVerifier?: string
      grantType: 'authorization_code' | 'refresh_token'
    }

    let storedTokens: StoredAuthTokens | null = null

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
      storedTokens = parseStoredAuthTokensCookie(tokenCookie?.value)
      const refreshToken = storedTokens?.refreshToken
      if (!refreshToken) {
        return jsonNoStore({ error: 'No refresh token available' }, { status: 400 })
      }
      params.set('grant_type', 'refresh_token')
      params.set('refresh_token', refreshToken)
    } else {
      return jsonNoStore({ error: 'Invalid grantType' }, { status: 400 })
    }

    const tokenResponse = await fetch(`${ZITADEL_ISSUER}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    const payload = await readJsonPayload(tokenResponse)

    if (!tokenResponse.ok) {
      return jsonNoStore(
        payload && typeof payload === 'object' ? payload : { error: 'Identity provider request failed' },
        { status: tokenResponse.status }
      )
    }

    const data = normalizeTokenEndpointResponse(payload)
    if (!data) {
      return jsonNoStore({ error: 'Invalid token response from identity provider' }, { status: 502 })
    }

    // For refresh_token grants, update the cookie server-side to preserve the refresh token
    if (grantType === 'refresh_token') {
      const currentStoredTokens = storedTokens
      if (!currentStoredTokens) {
        return jsonNoStore({ error: 'No refresh token available' }, { status: 400 })
      }

      const idToken = data.id_token ?? currentStoredTokens.idToken
      if (!idToken) {
        return jsonNoStore({ error: 'Invalid token response from identity provider' }, { status: 502 })
      }

      const updatedTokens = {
        ...currentStoredTokens,
        accessToken: data.access_token,
        idToken,
        refreshToken: data.refresh_token ?? currentStoredTokens.refreshToken,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      }

      const serialized = JSON.stringify(updatedTokens)
      if (serialized.length > 3900) {
        return jsonNoStore({ error: 'Token payload too large for cookie storage' }, { status: 413 })
      }

      const safeData = {
        access_token: data.access_token,
        id_token: idToken,
        expires_in: data.expires_in,
      }
      return setAuthCookie(jsonNoStore(safeData), serialized)
    }

    // For authorization_code grants, store all tokens (incl. refresh) in httpOnly cookie
    // and return only client-safe fields (no refresh_token)
    if (!data.id_token) {
      return jsonNoStore({ error: 'Invalid token response from identity provider' }, { status: 502 })
    }

    const cookieTokens = {
      accessToken: data.access_token,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
    }

    const serialized = JSON.stringify(cookieTokens)
    if (serialized.length > 3900) {
      return jsonNoStore({ error: 'Token payload too large for cookie storage' }, { status: 413 })
    }

    const safeData = {
      access_token: data.access_token,
      id_token: data.id_token,
      expires_in: data.expires_in,
    }
    return setAuthCookie(jsonNoStore(safeData), serialized)
  } catch (error) {
    return jsonNoStore(
      { error: 'Internal error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
