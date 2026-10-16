import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { ACTIVE_COMPANY_COOKIE } from '@/lib/auth/companyContext'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { parseStoredAuthTokensCookie } from '@/lib/auth/storedTokens'

function noStore(body: unknown, status = 200): NextResponse {
  const res = NextResponse.json(body, { status })
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function GET(): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_TOKEN_COOKIE)?.value
  if (!token) return noStore(null, 401)
  const parsed = parseStoredAuthTokensCookie(token)
  // A stale GET must never delete cookies that another tab just rotated.
  // Session cleanup is an explicit conditional DELETE, not a GET side effect.
  if (!parsed) return noStore(null, 401)
  // The access/id/refresh tokens remain HttpOnly and are NEVER reflected in the response.
  return noStore({
    expiresAt: parsed.expiresAt,
    hasRefreshToken: Boolean(parsed.refreshToken),
    userRole: parsed.userRole,
    sessionRevision: parsed.sessionRevision,
  })
}

export async function POST(): Promise<NextResponse> {
  // No client-controlled JWT cookie writes. OAuth exchange owns session creation.
  return noStore({ error: 'Method Not Allowed' }, 405)
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get('origin')
  if (!origin || origin !== request.nextUrl.origin) return noStore({ error: 'Forbidden' }, 403)
  const expectedRevision = request.headers.get('x-session-revision')
  if (expectedRevision !== null) {
    // Conditional cleanup verifies the revision against the HttpOnly cookie
    // *on the server*, not against a previously fetched browser snapshot.
    const current = parseStoredAuthTokensCookie(request.cookies.get(AUTH_TOKEN_COOKIE)?.value)
    if (!current || !current.sessionRevision || current.sessionRevision !== expectedRevision) {
      return noStore({ error: 'Session changed' }, 409)
    }
  }

  const response = noStore({ ok: true })
  response.cookies.delete(AUTH_TOKEN_COOKIE)
  response.cookies.delete(ACTIVE_COMPANY_COOKIE)
  return response
}
