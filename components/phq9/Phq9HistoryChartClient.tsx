'use client'

import { BrainCircuit } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { SummaryCard } from '@/components/features/MoodTracker/TenDaysSummary/SummaryCard'
import { Phq9HistoryEntry } from '@/types/phq9'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart'

const chartConfig = {
  score: {
    label: 'PHQ-9',
    color: 'hsl(var(--info))',
  },
} satisfies ChartConfig

interface Props {
  history: Phq9HistoryEntry[]
  isStub?: boolean
}

export function Phq9HistoryChartClient({ history, isStub }: Props) {
  const t = useTranslations('pages.MentalCheck')
  const locale = useLocale()

  const chartData = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({ date: entry.date, score: entry.score }))

  return (
    <SummaryCard
      className="gap-0 max-md:mt-6 max-md:border-t max-md:border-border max-md:pt-6"
      title={isStub ? t('chart.stubNote') : t('chart.title')}
      icon={<BrainCircuit className="opacity-50" color="white" size={128} />}
    >
      <ChartContainer config={chartConfig}>
        <AreaChart margin={{ bottom: 40, top: 10, right: 16, left: -20 }} data={chartData}>
          <CartesianGrid vertical={false} strokeOpacity={0.12} />

          <defs>
            <linearGradient id="phq9FillClient" x1="0" y1="0" x2="0" y2="1">
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

          <YAxis reversed domain={[0, 27]} ticks={[0, 5, 10, 15, 20, 27]} tickLine={false} axisLine={false} />

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
            fill="url(#phq9FillClient)"
            fillOpacity={1}
            stroke="hsl(var(--info))"
            strokeWidth={3}
            dot={{ r: 4, fill: 'white', stroke: 'hsl(var(--info))', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ChartContainer>
    </SummaryCard>
  )
}
