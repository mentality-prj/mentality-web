'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { DEFAULT_VISIBLE_METRICS, METRIC_KEYS, TREND_CHART_CONFIG } from '@/constants/userStatistics'
import { SupportedLanguage } from '@/types/languages'
import { DailyPoint, MetricKey } from '@/types/userStatistics'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart'
import { Switch } from '@/ui/switch'

type TrendChartProps = {
  data: DailyPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  const t = useTranslations('components.UserStatistics')
  const locale = useLocale() as SupportedLanguage

  const [visibleMetrics, setVisibleMetrics] = useState<Record<MetricKey, boolean>>(DEFAULT_VISIBLE_METRICS)

  const toggleMetric = (key: MetricKey) => {
    setVisibleMetrics((prev) => ({ ...prev, [key as MetricKey]: !prev[key as MetricKey] }))
  }

  if (data.length === 0) {
    return (
      <div className="background-alt-white rounded-md p-6">
        <h3 className="text-xl font-semibold text-textcolor-primary">{t('trend.title')}</h3>
        <p className="py-8 text-center text-sm text-textcolor-secondary">{t('trend.noData')}</p>
      </div>
    )
  }

  return (
    <div className="background-alt-white rounded-md p-6">
      <h3 className="mb-5 text-xl font-semibold text-textcolor-primary">{t('trend.title')}</h3>

      <div className="relative">
        <div className="border-outline-tertiary absolute h-[92%] w-full rounded-sm border" />
        <ChartContainer config={TREND_CHART_CONFIG}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart margin={{ bottom: 56, top: 40, right: 25, left: -20 }} data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={56}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
                }
              />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                {METRIC_KEYS.map((key) => (
                  <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={1} />
                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              {METRIC_KEYS.map(
                (key) =>
                  visibleMetrics[key as MetricKey] && (
                    <Area
                      key={key}
                      dot={{ r: 4, fill: 'white', stroke: `var(--color-${key})`, strokeWidth: 2 }}
                      dataKey={key}
                      type="monotone"
                      fill={`url(#fill-${key})`}
                      fillOpacity={0.4}
                      stroke={`var(--color-${key})`}
                    />
                  )
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap justify-end gap-sm pt-6">
        {METRIC_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-xs">
            <Switch checked={visibleMetrics[key as MetricKey]} onCheckedChange={() => toggleMetric(key)} />
            <span className="text-sm">{t(`metrics.${key}`)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
