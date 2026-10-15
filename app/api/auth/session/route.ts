import { NextResponse } from 'next/server'

import { getServerSession } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession()
  const response = NextResponse.json(session?.user ?? null, { status: session?.user ? 200 : 401 })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
