import { NextRequest, NextResponse } from 'next/server'

import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { parseStoredAuthTokensCookie } from '@/lib/auth/storedTokens'

function reject(status: number): NextResponse {
  const response = NextResponse.json({ error: status === 403 ? 'Forbidden' : 'Misconfigured logout' }, { status })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get('origin')
  if (!origin || origin !== request.nextUrl.origin) return reject(403)

  const issuer = (process.env.NEXT_PUBLIC_ZITADEL_ISSUER ?? '').trim()
  const clientId = (process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID ?? '').trim()
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? '').trim()

  let issuerUrl: URL
  let redirectUrl: URL
  try {
    issuerUrl = new URL(issuer)
    redirectUrl = new URL(baseUrl)
    if (issuerUrl.protocol !== 'https:' || redirectUrl.origin !== request.nextUrl.origin || !clientId) {
      return reject(500)
    }
  } catch {
    return reject(500)
  }

  const cookie = request.cookies.get(AUTH_TOKEN_COOKIE)?.value
  const tokens = parseStoredAuthTokensCookie(cookie)
  const target = new URL('/oidc/v1/end_session', issuerUrl)
  target.searchParams.set('client_id', clientId)
  target.searchParams.set('post_logout_redirect_uri', redirectUrl.origin)
  if (tokens?.idToken) target.searchParams.set('id_token_hint', tokens.idToken)

  const response = NextResponse.redirect(target, { status: 303 })
  response.cookies.delete(AUTH_TOKEN_COOKIE)
  response.headers.set('Cache-Control', 'no-store')
  return response
}
