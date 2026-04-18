import { NextResponse } from 'next/server'

import { getServerSession } from '@/lib/get-server-session'
import { clearUserTagsCacheFor } from '@/lib/userTagsCache'

export async function POST() {
  try {
    const session = await getServerSession()
    const email = session?.user?.email

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    clearUserTagsCacheFor(email)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
