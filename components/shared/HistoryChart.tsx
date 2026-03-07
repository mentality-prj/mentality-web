'use client'

import { ReactNode } from 'react'
import { useLocale } from 'next-intl'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { SummaryCard } from '@/components/shared/Cards/SummaryCard'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart'

export interface HistoryEntry {
  date: string
  score: number
}

interface HistoryChartProps {
  history: HistoryEntry[]
  isStub?: boolean
  /** Chart series label, e.g. 'PHQ-9' or 'GAD-7' */
  chartLabel: string
  /** Line / dot / stroke color. Defaults to info CSS variable. */
  chartColor?: string
  /** Unique SVG gradient id — must be different per chart to avoid collisions. */
  gradientId: string
  /** Card title when showing real data */
  title: string
  /** Card title when showing stub data */
  stubTitle: string
  /** Icon rendered inside the card */
  icon: ReactNode
  /** Maximum value for the reversed YAxis domain */
  maxScore: number
  /** YAxis tick values */
  ticks?: number[]
}

export function HistoryChart({
  history,
  isStub,
  chartLabel,
  chartColor = 'hsl(var(--info))',
  gradientId,
  title,
  stubTitle,
  icon,
  maxScore,
  ticks,
}: HistoryChartProps) {
  const locale = useLocale()

  const chartConfig = {
    score: {
      label: chartLabel,
      color: chartColor,
    },
  } satisfies ChartConfig

  const chartData = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({ date: entry.date, score: entry.score }))

  const defaultTicks = ticks ?? [
    0,
    Math.round(maxScore / 4),
    Math.round(maxScore / 2),
    Math.round((maxScore * 3) / 4),
    maxScore,
  ]

  return (
    <SummaryCard
      className="gap-0 max-md:mt-6 max-md:border-t max-md:border-border max-md:pt-6"
      title={isStub ? stubTitle : title}
      icon={icon}
    >
      <ChartContainer config={chartConfig}>
        <AreaChart margin={{ bottom: 40, top: 10, right: 16, left: -20 }} data={chartData}>
          <CartesianGrid vertical={false} strokeOpacity={0.12} />

          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--error))" stopOpacity={0.08} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            angle={-45}
            textAnchor="end"
            minTickGap={16}
            tickFormatter={(value) =>
              new Date(value as string).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
            }
          />

          <YAxis reversed domain={[0, maxScore]} ticks={defaultTicks} tickLine={false} axisLine={false} />

          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value as string).toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                }
              />
            }
          />

          <Area
            dataKey="score"
            type="bump"
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            stroke={chartColor}
            strokeWidth={3}
            dot={{ r: 4, fill: 'white', stroke: chartColor, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ChartContainer>
    </SummaryCard>
  )
}
