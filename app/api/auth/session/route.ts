import { NextResponse } from 'next/server'

import { getServerSessionStrict } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSessionStrict()
    const response = NextResponse.json(session?.user ?? null, { status: session?.user ? 200 : 401 })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch {
    const response = NextResponse.json({ error: 'Session validation temporarily unavailable' }, { status: 503 })
    response.headers.set('Cache-Control', 'no-store')
    return response
  }
}
