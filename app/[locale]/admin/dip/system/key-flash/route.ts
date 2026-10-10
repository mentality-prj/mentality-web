import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { DIP_NEW_KEY_FLASH_COOKIE } from '@/app/[locale]/admin/dip/system/constants'
import { getServerSession } from '@/lib/auth/server'
import { type SupportedLanguage, supportedLanguages } from '@/types/languages'

function normalizeLocale(locale: string): SupportedLanguage {
  if (supportedLanguages.includes(locale as SupportedLanguage)) {
    return locale as SupportedLanguage
  }

  return 'uk'
}

function jsonNoStore(body: unknown, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(body, init)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }): Promise<NextResponse> {
  const session = await getServerSession()
  if (session?.user?.role !== 'admin') {
    return jsonNoStore({ error: 'Forbidden' }, { status: 403 })
  }

  const { locale } = await context.params
  const safeLocale = normalizeLocale(locale)
  const cookieStore = cookies()
  const key = cookieStore.get(DIP_NEW_KEY_FLASH_COOKIE)?.value

  const response = key ? jsonNoStore({ key }) : new NextResponse(null, { status: 204 })
  response.headers.set('Cache-Control', 'no-store')
  response.cookies.set(DIP_NEW_KEY_FLASH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: `/${safeLocale}/admin/dip/system`,
    maxAge: 0,
  })

  return response
}
