import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { PHQ9_STUB_HISTORY } from '@/constants/phq9'
import { APIUrl } from '@/requests/config'
import { Phq9HistoryEntry } from '@/types/phq9'

import { Phq9HistoryChartClient } from './Phq9HistoryChartClient'

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
      history = PHQ9_STUB_HISTORY
      isStub = true
    }
  } catch {
    history = PHQ9_STUB_HISTORY
    isStub = true
  }

  return <Phq9HistoryChartClient history={history} isStub={isStub} />
}
