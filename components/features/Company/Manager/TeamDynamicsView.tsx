'use client'

import { useMemo } from 'react'
import { useLocale } from 'next-intl'
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { InsightCardPanel } from '@/components/shared/reporting/ReportingPrimitives'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { useTeamDynamics } from '@/hooks/useTeamDynamics'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

function intensityClass(intensity: 'low' | 'medium' | 'high' | 'masked'): string {
  switch (intensity) {
    case 'high':
      return 'bg-rose-100 text-rose-700'
    case 'medium':
      return 'bg-amber-100 text-amber-700'
    case 'low':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function TeamDynamicsView() {
  const locale = useLocale()
  const copy = getReportingCopy(locale)
  const {
    teamId,
    setTeamId,
    teamOptions,
    teamsLoading,
    teamsError,
    from,
    to,
    setFrom,
    setTo,
    teamDynamics,
    loading,
    error,
    dateError,
    refresh,
  } = useTeamDynamics()

  const chartData = useMemo(
    () =>
      teamDynamics?.aggregateTrend.points.map((point) => ({
        label: point.label,
        value: point.value,
        baseline: point.baseline,
      })) ?? [],
    [teamDynamics]
  )

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-background-alt p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-textcolor-primary">{copy.teamDynamics.title}</h2>
            <p className="mt-1 text-sm text-textcolor-secondary">{copy.teamDynamics.aggregateTrend}</p>
          </div>
          <Button variant="secondary" onClick={refresh} disabled={loading || !teamId}>
            {copy.common.refresh}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="team-dynamics-team">{copy.diagnostics.team}</Label>
            <Select
              value={teamId || undefined}
              onValueChange={setTeamId}
              disabled={teamsLoading || teamOptions.length === 0}
            >
              <SelectTrigger id="team-dynamics-team" className="bg-background">
                <SelectValue placeholder={copy.diagnostics.teamPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {teamOptions.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-dynamics-from">{copy.common.from}</Label>
            <Input id="team-dynamics-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-dynamics-to">{copy.common.to}</Label>
            <Input id="team-dynamics-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </div>
        </div>

        {teamsError ? <p className="text-destructive mt-3 text-sm">{teamsError}</p> : null}
        {!teamsLoading && !teamsError && teamOptions.length === 0 ? (
          <p className="mt-3 text-sm text-textcolor-secondary">{copy.diagnostics.noTeamsAvailable}</p>
        ) : null}
        {dateError ? <p className="text-destructive mt-3 text-sm">{dateError}</p> : null}
        {error ? <p className="text-destructive mt-3 text-sm">{error}</p> : null}
      </section>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-background-alt" />
      ) : teamDynamics ? (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <InsightCardPanel card={teamDynamics.propagationRisk} />
            <InsightCardPanel card={teamDynamics.synchronizedDeterioration} />
            <div className="rounded-2xl border border-border bg-background-alt p-5">
              <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">{copy.common.confidence}</h3>
              <div className="mt-4">
                <InsightCardPanel
                  card={{
                    id: 'team-dynamics-confidence-card',
                    title: copy.teamDynamics.title,
                    text: teamDynamics.confidence.label,
                    supportingText: teamDynamics.confidence.reason,
                    tone: 'neutral',
                    presentation: 'badge',
                    confidence: teamDynamics.confidence,
                    recommendedAction: teamDynamics.confidence.improveQualityHint,
                    updatedAt: null,
                    visibilityRules: teamDynamics.confidence.visibilityRules,
                  }}
                />
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-border bg-background-alt p-5">
            <h3 className="text-lg font-semibold text-textcolor-primary">{copy.teamDynamics.aggregateTrend}</h3>
            <div className="mt-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 5]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#e76f51" fill="#f4a261" fillOpacity={0.18} />
                  <Line type="monotone" dataKey="baseline" stroke="#264653" strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-border bg-background-alt p-5">
              <h3 className="text-lg font-semibold text-textcolor-primary">{copy.teamDynamics.heatmap}</h3>
              <div className="mt-4 space-y-3">
                {teamDynamics.heatmap.map((row) => (
                  <div key={row.id} className="rounded-xl border border-border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-textcolor-primary">{row.label}</p>
                        <p className="text-sm text-textcolor-secondary">{row.aggregateLabel}</p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${intensityClass(row.intensity)}`}
                      >
                        {row.intensity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4">
              <div className="rounded-2xl border border-border bg-background-alt p-5">
                <h3 className="text-lg font-semibold text-textcolor-primary">{copy.teamDynamics.insightCards}</h3>
                <div className="mt-4 grid gap-3">
                  {teamDynamics.insightCards.map((card) => (
                    <InsightCardPanel key={card.id} card={card} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background-alt p-5">
                <h3 className="text-lg font-semibold text-textcolor-primary">{copy.teamDynamics.trendDetail}</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-textcolor-primary">{copy.teamDynamics.keyChanges}</h4>
                    <ul className="mt-3 space-y-2 text-sm text-textcolor-secondary">
                      {teamDynamics.trendDetail.keyChanges.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-textcolor-primary">
                      {copy.teamDynamics.recommendedInterventions}
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-textcolor-secondary">
                      {teamDynamics.trendDetail.recommendedInterventions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-textcolor-secondary">
                      {copy.teamDynamics.privacyState}: {teamDynamics.trendDetail.privacyState}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  )
}
