import { NextRequest, NextResponse } from 'next/server'

import { requestAccountErasureBackend } from '@/lib/backend/accountErasure.server'
import { ACTIVE_COMPANY_COOKIE } from '@/lib/auth/companyContext'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { getServerSessionStrict } from '@/lib/auth/server'
import { parseStoredAuthTokensCookie } from '@/lib/auth/storedTokens'

export const dynamic = 'force-dynamic'
const CONFIRMATION = 'DELETE MY ACCOUNT'

function json(body: unknown, status: number): NextResponse {
  const response = NextResponse.json(body, { status })
  response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  response.headers.set('Vary', 'Cookie')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const site = request.headers.get('sec-fetch-site')
  return origin === request.nextUrl.origin && (!site || site === 'same-origin')
}

async function getAuthenticatedBackendContext(request: NextRequest) {
  // Strict validation; an unverified/expired cookie cannot be used for erasure.
  const session = await getServerSessionStrict()
  const stored = parseStoredAuthTokensCookie(request.cookies.get(AUTH_TOKEN_COOKIE)?.value)
  if (!session?.user?.id || !session.OAuthToken || !stored?.idToken) return null
  return { bearer: session.OAuthToken, idToken: stored.idToken }
}

async function forwardRequest(request: NextRequest, method: 'GET' | 'POST', body?: object): Promise<NextResponse> {
  try {
    const context = await getAuthenticatedBackendContext(request)
    if (!context) return json({ error: 'Unauthorized' }, 401)
    const upstream = await requestAccountErasureBackend(
      context.bearer,
      method,
      method === 'POST' ? { confirmation: String(body && 'confirmation' in body ? body.confirmation : ''), idToken: context.idToken } : undefined
    )
    if (upstream.status >= 300 && upstream.status < 400) return json({ error: 'Unexpected redirect' }, 502)
    if (upstream.status === 401) return json({ error: 'Fresh authentication required' }, 401)
    if (upstream.status === 403)
      return json({ error: 'Account has shared access or cannot be erased automatically' }, 403)
    if (upstream.status === 409) return json({ error: 'Account data requires manual review' }, 409)
    if (!upstream.ok)
      return json({ error: 'Account erasure is currently unavailable' }, upstream.status >= 500 ? 503 : 400)

    // Limit upstream payloads: response should contain only enum-like status,
    // never pass raw provider errors or cookies to the browser.
    const data: unknown = await upstream.json()
    if (!data || typeof data !== 'object') return json({ error: 'Invalid response' }, 502)
    const record = data as Record<string, unknown>
    const status = record.status === 'erasure_in_progress' ? 'erasure_in_progress' : 'not_requested'
    if (method === 'GET') {
      return json(
        {
          available: record.available === true,
          requiresFreshAuthentication: true,
          status,
          scope: 'dzvin_app_only',
        },
        200
      )
    }
    if (upstream.status !== 202 || status !== 'erasure_in_progress') return json({ error: 'Invalid result' }, 502)

    const response = json(
      {
        status: 'erasure_in_progress',
        knownPersonalDataPurged: record.knownPersonalDataPurged === true,
        scope: 'dzvin_app_only',
      },
      202
    )
    // Revoke ONLY the Dzvin application's browser session. Do not send a
    // global Zitadel logout or delete the identity used by other apps.
    response.cookies.delete(AUTH_TOKEN_COOKIE)
    response.cookies.delete(ACTIVE_COMPANY_COOKIE)
    return response
  } catch {
    return json({ error: 'Account erasure service temporarily unavailable' }, 503)
  }
}

export async function GET(request: NextRequest) {
  return forwardRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  // Never accept CSRF-prone cross-origin mutations.
  if (!isSameOrigin(request)) return json({ error: 'Forbidden' }, 403)
  if (Number(request.headers.get('content-length')) > 1024) return json({ error: 'Payload too large' }, 413)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }
  if (!body || typeof body !== 'object' || (body as Record<string, unknown>).confirmation !== CONFIRMATION) {
    return json({ error: 'Explicit confirmation required' }, 400)
  }
  return forwardRequest(request, 'POST', { confirmation: CONFIRMATION })
}
