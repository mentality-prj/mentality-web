'use client'

import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import {
  ConfidenceIndicator,
  InsightCardPanel,
  StateExplanationCard,
  WhyAmISeeingThisCard,
} from '@/components/shared/reporting/ReportingPrimitives'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { PersonalRiskOverviewVM, PersonalRiskTimelineVM } from '@/types/reporting'
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs'

type Props = {
  overview: PersonalRiskOverviewVM
  timelines: Record<'7d' | '14d' | '30d', PersonalRiskTimelineVM>
}

function getTimelineByPeriod(
  timelines: Record<'7d' | '14d' | '30d', PersonalRiskTimelineVM>,
  period: '7d' | '14d' | '30d'
): PersonalRiskTimelineVM {
  switch (period) {
    case '7d':
      return timelines['7d']
    case '14d':
      return timelines['14d']
    default:
      return timelines['30d']
  }
}

export function PersonalRiskDashboard({ overview, timelines }: Props) {
  const locale = useLocale()
  const copy = getReportingCopy(locale)
  const [activePeriod, setActivePeriod] = useState<'7d' | '14d' | '30d'>('30d')
  const activeTimeline = getTimelineByPeriod(timelines, activePeriod)

  const chartData = useMemo(
    () =>
      activeTimeline.points.map((point) => ({
        label: point.label,
        value: point.value,
        baseline: point.baseline,
      })),
    [activeTimeline]
  )

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-background-alt p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-textcolor-primary">{copy.personalRisk.overviewTitle}</h2>
            <p className="mt-1 text-sm text-textcolor-secondary">
              {copy.personalRisk.updatedTime}: {overview.updatedAt ?? copy.common.notAvailable}
            </p>
          </div>
          <div className="min-w-[240px] rounded-2xl border border-border bg-background p-4">
            <ConfidenceIndicator badge={overview.confidence} />
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-4">
          <InsightCardPanel card={overview.currentRiskLevel} />
          <InsightCardPanel card={overview.deviationFromBaseline} />
          <InsightCardPanel card={overview.recentTrend} />
          <div className="rounded-2xl border border-border bg-background p-5">
            <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
              {copy.personalRisk.topInsights}
            </h3>
            <div className="mt-4 space-y-3 text-sm text-textcolor-secondary">
              {overview.topInsights.slice(0, 3).map((insight) => (
                <p key={insight.id}>{insight.title}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background-alt p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-textcolor-primary">{copy.personalRisk.timelineTitle}</h2>
            <p className="mt-1 text-sm text-textcolor-secondary">
              {copy.personalRisk.trendDirection}: {activeTimeline.trendDirection}
            </p>
          </div>
          <Tabs value={activePeriod} onValueChange={(value) => setActivePeriod(value as '7d' | '14d' | '30d')}>
            <TabsList variant="grey">
              <TabsTrigger value="7d" variant="grey">
                {copy.personalRisk.period7d}
              </TabsTrigger>
              <TabsTrigger value="14d" variant="grey">
                {copy.personalRisk.period14d}
              </TabsTrigger>
              <TabsTrigger value="30d" variant="grey">
                {copy.personalRisk.period30d}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-4 h-[320px] rounded-2xl border border-border bg-background p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} domain={[0, 5]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2a9d8f"
                fill="#2a9d8f"
                fillOpacity={
                  activeTimeline.confidence.score != null ? 0.12 + activeTimeline.confidence.score * 0.18 : 0.12
                }
              />
              <Line type="monotone" dataKey="baseline" stroke="#264653" strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-3 text-sm text-textcolor-secondary">
          {copy.personalRisk.baselineReference}: {activeTimeline.baselineReferenceLabel}
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {overview.topInsights.map((card) => (
          <StateExplanationCard key={card.id} card={card} />
        ))}
      </div>

      <WhyAmISeeingThisCard value={overview.whySeeingThis} />
    </div>
  )
}
