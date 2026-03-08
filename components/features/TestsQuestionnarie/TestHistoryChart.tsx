import { Activity } from 'lucide-react'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { HistoryChart } from '@/components/shared/HistoryChart'
import { APIUrl } from '@/requests/config'

interface HistoryEntry {
  date: string
  score: number
}

function buildStubHistory(maxScore: number): HistoryEntry[] {
  const base = new Date()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const start = Math.round(maxScore * 0.7)
  const end = Math.round(maxScore * 0.3)
  const step = Math.round((start - end) / 4)
  return [start, start - step, start - step * 2, start - step * 3, end].map((score, i) => ({
    date: new Date(base.getTime() - (4 - i) * weekMs).toISOString(),
    score,
  }))
}

interface Props {
  apiEndpoint: string
  maxScore: number
  chartLabel: string
}

export async function TestHistoryChart({ apiEndpoint, maxScore, chartLabel }: Props) {
  const headers = await getAuthHeaders()

  let history: HistoryEntry[] = []
  let isStub = false

  try {
    const res = await fetch(`${APIUrl}/${apiEndpoint}/history`, { headers, cache: 'no-store' })
    if (!res.ok) {
      history = buildStubHistory(maxScore)
      isStub = true
    } else {
      const raw: HistoryEntry[] = await res.json()
      if (Array.isArray(raw) && raw.length >= 2) {
        history = raw
      } else {
        history = buildStubHistory(maxScore)
        isStub = true
      }
    }
  } catch {
    history = buildStubHistory(maxScore)
    isStub = true
  }

  return (
    <HistoryChart
      history={history}
      isStub={isStub}
      chartLabel={chartLabel}
      gradientId={`${apiEndpoint}Fill`}
      title="Динаміка результатів"
      stubTitle="Пройдіть тест кілька разів, щоб побачити динаміку"
      icon={<Activity className="opacity-50" color="white" size={128} />}
      maxScore={maxScore}
    />
  )
}
