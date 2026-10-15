import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { ACTIVE_COMPANY_COOKIE } from '@/lib/auth/companyContext'
import { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { coalesceRefreshExchange } from '@/lib/auth/serverRefreshFlight'
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

const MAX_EXCHANGE_BODY_BYTES = 8_192
const MAX_TOKEN_RESPONSE_BYTES = 32_768
const TOKEN_TIMEOUT_MS = 8_000

// Every caller, including the internal proxy refresh, must supply the exact
// target origin. Missing Origin is not a trusted server-to-server signal.
function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const fetchSite = request.headers.get('sec-fetch-site')
  if (!origin || (fetchSite && fetchSite !== 'same-origin')) return false
  try {
    return new URL(origin).origin === request.nextUrl.origin
  } catch {
    return false
  }
}

async function readLimitedText(source: NextRequest | Response, maxBytes: number): Promise<string> {
  const reader = source.body?.getReader()
  if (!reader) {
    const text = await source.text()
    if (new TextEncoder().encode(text).byteLength > maxBytes) throw new RangeError('Payload too large')
    return text
  }

  const parts: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value.byteLength > maxBytes - size) {
        await reader.cancel().catch(() => undefined)
        throw new RangeError('Payload too large')
      }
      parts.push(value)
      size += value.byteLength
    }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(size)
  let offset = 0
  for (const part of parts) {
    bytes.set(part, offset)
    offset += part.byteLength
  }
  return new TextDecoder().decode(bytes)
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
  // Stream/transport failures must propagate to the outer handler. In particular,
  // a body that stalls after successful response headers can still time out.
  const text = await readLimitedText(response, MAX_TOKEN_RESPONSE_BYTES)
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    // Only malformed JSON is treated as an invalid provider payload.
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
  const REDIRECT_URI = new URL('/callback', request.nextUrl.origin).toString()

  if (!ZITADEL_ISSUER || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI.startsWith('http')) {
    return jsonNoStore({ error: 'Server misconfiguration: missing Zitadel environment variables' }, { status: 500 })
  }

  // CSRF: reject requests without trusted same-origin provenance (including internal refresh).
  if (!isSameOriginRequest(request)) {
    return jsonNoStore({ error: 'Forbidden' }, { status: 403 })
  }

  let body: {
    code?: string
    codeVerifier?: string
    grantType?: 'authorization_code' | 'refresh_token'
  }

  try {
    const contentLength = Number(request.headers.get('content-length'))
    if (contentLength > MAX_EXCHANGE_BODY_BYTES) {
      return jsonNoStore({ error: 'Payload too large' }, { status: 413 })
    }
    body = JSON.parse(await readLimitedText(request, MAX_EXCHANGE_BODY_BYTES)) as {
      code?: string
      codeVerifier?: string
      grantType?: 'authorization_code' | 'refresh_token'
    }
  } catch (error) {
    if (error instanceof RangeError) {
      return jsonNoStore({ error: 'Payload too large' }, { status: 413 })
    }
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
      const cookieStore = await cookies()
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

    const callProvider = async () => {
      const tokenSignal = AbortSignal.timeout(TOKEN_TIMEOUT_MS)
      try {
        const response = await fetch(`${ZITADEL_ISSUER}/oauth/v2/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params,
          redirect: 'manual',
          cache: 'no-store',
          signal: tokenSignal,
        })
        const payload = await readJsonPayload(response)
        return {
          ok: response.ok,
          status: response.status,
          payload,
          issuedAt: Math.floor(Date.now() / 1000),
          sessionRevision: crypto.randomUUID(),
        }
      } catch (error) {
        // A body stream can throw AbortError although the deadline elapsed.
        const reason = tokenSignal?.aborted ? tokenSignal.reason : null
        if (reason instanceof Error && reason.name === 'TimeoutError') throw reason
        throw error
      }
    }

    const exchangeResult =
      grantType === 'refresh_token' && storedTokens?.refreshToken
        ? await coalesceRefreshExchange(storedTokens.refreshToken, callProvider)
        : await callProvider()
    const payload = exchangeResult.payload

    if (!exchangeResult.ok) {
      // Never reflect identity-provider JSON (including diagnostic secrets).
      const status =
        exchangeResult.status === 429 ? 429 : exchangeResult.status >= 300 && exchangeResult.status < 500 ? 400 : 502
      return jsonNoStore({ error: 'Identity provider request failed' }, { status })
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
        sessionRevision: exchangeResult.sessionRevision,
        expiresAt: exchangeResult.issuedAt + data.expires_in,
      }

      const serialized = JSON.stringify(updatedTokens)
      if (serialized.length > 3900) {
        return jsonNoStore({ error: 'Token payload too large for cookie storage' }, { status: 413 })
      }

      const safeData = {
        expiresAt: updatedTokens.expiresAt,
        hasRefreshToken: Boolean(updatedTokens.refreshToken),
        userRole: updatedTokens.userRole,
        sessionRevision: updatedTokens.sessionRevision,
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
      sessionRevision: exchangeResult.sessionRevision,
      expiresAt: exchangeResult.issuedAt + data.expires_in,
    }

    const serialized = JSON.stringify(cookieTokens)
    if (serialized.length > 3900) {
      return jsonNoStore({ error: 'Token payload too large for cookie storage' }, { status: 413 })
    }

    const safeData = {
      expiresAt: cookieTokens.expiresAt,
      hasRefreshToken: Boolean(cookieTokens.refreshToken),
      sessionRevision: cookieTokens.sessionRevision,
    }
    const response = setAuthCookie(jsonNoStore(safeData), serialized)
    // A new login must not inherit the previous account's selected tenant.
    response.cookies.delete(ACTIVE_COMPANY_COOKIE)
    return response
  } catch (error) {
    // callProvider normalizes stream AbortError to the deadline's TimeoutError.
    const timedOut = error instanceof Error && error.name === 'TimeoutError'
    return jsonNoStore({ error: 'Identity provider temporarily unavailable' }, { status: timedOut ? 504 : 502 })
  }
}
