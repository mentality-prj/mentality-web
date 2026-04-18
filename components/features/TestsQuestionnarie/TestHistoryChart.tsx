import { Activity } from 'lucide-react'

import { HistoryChart } from '@/components/shared/HistoryChart'
import { getServerSession } from '@/lib/get-server-session'
import { APIUrl } from '@/requests/config'
import { performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'

interface HistoryEntry {
  date: string
  score: number
}

function buildStubHistory(maxScore: number): HistoryEntry[] {
  const base = new Date()
  const monthMs = 30 * 24 * 60 * 60 * 1000
  const start = Math.round(maxScore * 0.7)
  const end = Math.round(maxScore * 0.3)
  const step = Math.round((start - end) / 4)
  return [start, start - step, start - step * 2, start - step * 3, end].map((score, i) => ({
    date: new Date(base.getTime() - (4 - i) * monthMs).toISOString(),
    score,
  }))
}

interface Props {
  apiEndpoint: string
  maxScore: number
  chartLabel: string
  title: string
  stubTitle: string
}

export async function TestHistoryChart({ apiEndpoint, maxScore, chartLabel, title, stubTitle }: Props) {
  const session = await getServerSession()

  let history: HistoryEntry[] = []
  let isStub = false

  const res = await performAuthRequest<HistoryEntry[]>(
    session as CustomSession | null,
    `${APIUrl}/${apiEndpoint}/history`
  )

  if ('error' in res || !Array.isArray(res.data) || res.data.length < 2) {
    history = buildStubHistory(maxScore)
    isStub = true
  } else {
    history = res.data
  }

  return (
    <HistoryChart
      history={history}
      isStub={isStub}
      chartLabel={chartLabel}
      gradientId={`${apiEndpoint}Fill`}
      title={title}
      stubTitle={stubTitle}
      icon={<Activity className="opacity-50" color="white" size={128} />}
      maxScore={maxScore}
    />
  )
}
