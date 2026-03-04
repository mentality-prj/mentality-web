import { NextResponse } from 'next/server'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { PHQ9_STUB_HISTORY } from '@/constants/phq9'
import { APIUrl } from '@/requests/config'
import { Phq9HistoryEntry } from '@/types/phq9'

export async function GET() {
  try {
    const headers = await getAuthHeaders()

    const res = await fetch(`${APIUrl}/phq9/history`, { headers })
    const data: Phq9HistoryEntry[] = await res.json()

    return NextResponse.json(data.length > 0 ? data : PHQ9_STUB_HISTORY, { status: 200 })
  } catch {
    return NextResponse.json(PHQ9_STUB_HISTORY, { status: 200 })
  }
}
