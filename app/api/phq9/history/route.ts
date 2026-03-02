import { NextResponse } from 'next/server'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'
import { Phq9HistoryEntry } from '@/types/phq9'

// TODO: remove stub when backend history is populated
const STUB_HISTORY: Phq9HistoryEntry[] = [
  { date: '2025-11-04T10:00:00.000Z', score: 20 },
  { date: '2025-11-11T10:00:00.000Z', score: 18 },
  { date: '2025-11-18T10:00:00.000Z', score: 16 },
  { date: '2025-11-25T10:00:00.000Z', score: 14 },
  { date: '2025-12-02T10:00:00.000Z', score: 12 },
  { date: '2026-01-06T10:00:00.000Z', score: 10 },
  { date: '2026-01-20T10:00:00.000Z', score: 9 },
  { date: '2026-02-03T10:00:00.000Z', score: 8 },
  { date: '2026-02-10T10:00:00.000Z', score: 7 },
  { date: '2026-02-17T10:00:00.000Z', score: 6 },
  { date: '2026-02-24T10:00:00.000Z', score: 5 },
  { date: '2026-03-02T10:00:00.000Z', score: 3 },
]

export async function GET() {
  try {
    const headers = await getAuthHeaders()

    const res = await fetch(`${APIUrl}/phq9/history`, { headers })
    const data: Phq9HistoryEntry[] = await res.json()

    return NextResponse.json(data.length > 0 ? data : STUB_HISTORY, { status: 200 })
  } catch {
    return NextResponse.json(STUB_HISTORY, { status: 200 })
  }
}
