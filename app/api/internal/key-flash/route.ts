import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { DIP_NEW_KEY_FLASH_COOKIE } from '@/app/[locale]/admin/dip/system/constants'
import { getServerSession } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Only same-origin browser code should consume this one-time secret.
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }

  const session = await getServerSession()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }

  const store = await cookies()
  const key = store.get(DIP_NEW_KEY_FLASH_COOKIE)?.value
  const response = key ? NextResponse.json({ key }) : new NextResponse(null, { status: 204 })
  response.headers.set('Cache-Control', 'no-store')
  response.cookies.set(DIP_NEW_KEY_FLASH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/internal/key-flash',
    maxAge: 0,
  })
  return response
}
