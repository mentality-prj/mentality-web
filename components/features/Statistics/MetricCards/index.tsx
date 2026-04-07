'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { METRIC_COLORS, METRIC_KEYS } from '@/constants/userStatistics'
import { AverageMetrics, MetricKey, TimePeriod } from '@/types/userStatistics'
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs'

type MetricCardsProps = {
  allTime: AverageMetrics
  last7d: AverageMetrics | null
  last30d: AverageMetrics | null
}

export function MetricCards({ allTime, last7d, last30d }: MetricCardsProps) {
  const t = useTranslations('components.UserStatistics')
  const [period, setPeriod] = useState<TimePeriod>('allTime')

  const metricsMap: Record<TimePeriod, AverageMetrics | null> = {
    allTime,
    last7d,
    last30d,
  }

  const currentMetrics = metricsMap[period as TimePeriod]

  return (
    <div className="background-alt-white rounded-md p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-textcolor-primary">{t('metrics.title')}</h3>
        <Tabs defaultValue="allTime" onValueChange={(v) => setPeriod(v as TimePeriod)}>
          <TabsList className="gap-3">
            <TabsTrigger value="allTime">{t('metrics.allTime')}</TabsTrigger>
            <TabsTrigger value="last7d">{t('metrics.last7d')}</TabsTrigger>
            <TabsTrigger value="last30d">{t('metrics.last30d')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {currentMetrics ? (
        <div className="grid grid-cols-4 gap-sm">
          {METRIC_KEYS.map((key) => (
            <div
              key={key}
              className={`flex flex-col items-center gap-xs rounded-md p-4 ${METRIC_COLORS[key as MetricKey]}`}
            >
              <span className="text-2xl font-bold">{currentMetrics[key as MetricKey].toFixed(1)}</span>
              <span className="text-sm font-medium">{t(`metrics.${key}`)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-textcolor-secondary">{t('metrics.noData')}</p>
      )}
    </div>
  )
}
