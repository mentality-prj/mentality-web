import { ReactNode } from 'react'

import { SummaryCard } from '@/components/shared/Cards/SummaryCard'

export interface StaticHistoryEntry {
  date: string
  score: number
}

interface StaticHistoryChartCardProps {
  history: StaticHistoryEntry[]
  chartLabel: string
  chartColor: string
  title: string
  stubTitle: string
  icon: ReactNode
  maxScore: number
}

function getSparklinePoints(history: StaticHistoryEntry[], maxScore: number) {
  const width = 320
  const height = 140
  const paddingX = 12
  const paddingY = 12
  const innerWidth = width - paddingX * 2
  const innerHeight = height - paddingY * 2
  const denominator = Math.max(history.length - 1, 1)

  return history
    .map((entry, index) => {
      const x = paddingX + (index / denominator) * innerWidth
      const normalized = Math.min(Math.max(entry.score / maxScore, 0), 1)
      const y = paddingY + (1 - normalized) * innerHeight

      return `${x},${y}`
    })
    .join(' ')
}

export function StaticHistoryChartCard({
  history,
  chartLabel,
  chartColor,
  title,
  stubTitle,
  icon,
  maxScore,
}: StaticHistoryChartCardProps) {
  const sortedHistory = [...history].sort((a, b) => a.date.localeCompare(b.date))
  const points = getSparklinePoints(sortedHistory, maxScore)

  return (
    <SummaryCard title={stubTitle || title} icon={icon} className="gap-0">
      <div data-testid="history-chart-card" className="rounded-[20px] bg-white/70 p-4">
        <p className="text-textcolor-tertiary text-xs font-semibold uppercase tracking-[0.18em]">{chartLabel}</p>
        <svg
          viewBox="0 0 320 140"
          className="mt-3 h-36 w-full"
          role="img"
          aria-label={chartLabel}
          preserveAspectRatio="none"
        >
          <line x1="12" y1="128" x2="308" y2="128" stroke="currentColor" strokeOpacity="0.14" />
          <line x1="12" y1="12" x2="12" y2="128" stroke="currentColor" strokeOpacity="0.14" />
          <polyline
            points={points}
            fill="none"
            stroke={chartColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </SummaryCard>
  )
}
