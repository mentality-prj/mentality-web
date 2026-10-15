import { NextRequest, NextResponse } from 'next/server'

import { requestCompanyRole } from '@/lib/auth/companyBackend.server'
import { ACTIVE_COMPANY_COOKIE, isValidCompanyId } from '@/lib/auth/companyContext'
import { getServerSession } from '@/lib/auth/server'

const supportedLocales = ['uk', 'en', 'pl']

function reject(status: number): NextResponse {
  const result = NextResponse.json({ error: status === 403 ? 'Forbidden' : 'Unable to select company' }, { status })
  result.headers.set('Cache-Control', 'no-store')
  return result
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Same-origin form submission only; never accept an arbitrary redirect URL.
  const origin = request.headers.get('origin')
  if (!origin || origin !== request.nextUrl.origin) return reject(403)

  let data: FormData
  try {
    data = await request.formData()
  } catch {
    return reject(400)
  }

  const companyId = data.get('companyId')
  const locale = data.get('locale')
  if (
    typeof companyId !== 'string' ||
    !isValidCompanyId(companyId) ||
    typeof locale !== 'string' ||
    !supportedLocales.includes(locale)
  ) {
    return reject(400)
  }

  const session = await getServerSession()
  if (!session?.user?.id || !session.OAuthToken) return reject(401)
  if (session.user.role === 'admin') return reject(403)

  let checked: { _id?: string; companyId?: string; companyRole?: string; role?: string }
  try {
    const response = await requestCompanyRole(session.OAuthToken, companyId)
    if (!response.ok) return reject([401, 403].includes(response.status) ? response.status : 503)
    checked = await response.json()
  } catch {
    return reject(503)
  }

  // Treat the selection as an untrusted hint until the backend returns its own role.
  if (
    String(checked._id ?? '') !== session.user.id ||
    checked.companyId !== companyId ||
    !['superuser', 'manager', 'employee'].includes(checked.companyRole ?? '') ||
    checked.role === 'admin'
  ) {
    return reject(403)
  }

  const result = NextResponse.redirect(new URL('/' + locale + '/company', request.nextUrl.origin), { status: 303 })
  result.cookies.set(ACTIVE_COMPANY_COOKIE, companyId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
  result.headers.set('Cache-Control', 'no-store')
  return result
}
