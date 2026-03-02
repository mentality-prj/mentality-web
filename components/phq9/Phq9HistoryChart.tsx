import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'
import { Phq9HistoryEntry } from '@/types/phq9'

import { Phq9HistoryChartClient } from './Phq9HistoryChartClient'

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

export default async function Phq9HistoryChart() {
  const headers = await getAuthHeaders()

  let history: Phq9HistoryEntry[] = []
  let isStub = false
  try {
    const res = await fetch(`${APIUrl}/phq9/history`, { headers, cache: 'no-store' })
    const raw: Phq9HistoryEntry[] = await res.json()
    if (Array.isArray(raw) && raw.length >= 2) {
      history = raw
    } else {
      history = STUB_HISTORY
      isStub = true
    }
  } catch {
    history = STUB_HISTORY
    isStub = true
  }

  return <Phq9HistoryChartClient history={history} isStub={isStub} />
}
