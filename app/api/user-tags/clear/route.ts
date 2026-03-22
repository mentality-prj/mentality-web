import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { clearUserTagsCacheFor } from '@/lib/userTagsCache'

export async function POST() {
  try {
    const session = await auth()
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
