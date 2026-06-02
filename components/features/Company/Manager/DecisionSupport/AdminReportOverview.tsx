'use client'

import { useLocale } from 'next-intl'

import { ConfidenceIndicator, InsightCardPanel } from '@/components/shared/reporting/ReportingPrimitives'
import { REPORTING_PRESENTATION_POLICY } from '@/constants/reportingPresentation'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { getRenderableFields } from '@/helpers/reportingVisibility'
import { ReportOverviewVM, ViewerRole } from '@/types/reporting'
import { Button } from '@/ui/button'

type Props = {
  overview: ReportOverviewVM | null
  loading: boolean
  error: string | null
  viewerRole: ViewerRole
  onRetry: () => Promise<void>
}

export function AdminReportOverview({ overview, loading, error, viewerRole, onRetry }: Props) {
  const locale = useLocale()
  const copy = getReportingCopy(locale)
  const visibleFields = new Set(
    getRenderableFields(REPORTING_PRESENTATION_POLICY.reportOverview, {
      viewerRole,
      mode: 'operational',
      aggregateOnly: true,
    })
  )

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-2xl border border-border bg-background-alt" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-destructive/30 bg-destructive/10 rounded-2xl border p-5">
        <p className="text-destructive text-sm">{error}</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry}>
            {copy.common.retry}
          </Button>
        </div>
      </div>
    )
  }

  if (!overview) {
    return null
  }

  return (
    <section className="flex flex-col gap-4">
      {overview.executiveSummary ? <InsightCardPanel card={overview.executiveSummary} /> : null}

      {visibleFields.has('companyHealthSummary') ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {overview.companyHealthSummary.map((card) => (
            <InsightCardPanel key={card.id} card={card} />
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4">
          {visibleFields.has('actionsList') ? (
            <section className="rounded-2xl border border-border bg-background-alt p-5">
              <h3 className="text-lg font-semibold text-textcolor-primary">{copy.reportOverview.actionsList}</h3>
              <div className="mt-4 grid gap-3">
                {overview.actionsList.map((card) => (
                  <InsightCardPanel key={card.id} card={card} />
                ))}
              </div>
            </section>
          ) : null}

          {visibleFields.has('signalsSummary') ? (
            <section className="rounded-2xl border border-border bg-background-alt p-5">
              <h3 className="text-lg font-semibold text-textcolor-primary">{copy.reportOverview.signalsSummary}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {overview.signalsSummary.map((card) => (
                  <InsightCardPanel key={card.id} card={card} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="grid gap-4">
          {visibleFields.has('teamRanking') ? (
            <section className="rounded-2xl border border-border bg-background-alt p-5">
              <h3 className="text-lg font-semibold text-textcolor-primary">{copy.reportOverview.teamRanking}</h3>
              <ol className="mt-4 space-y-3">
                {overview.teamRanking.map((item) => (
                  <li key={item.id} className="rounded-xl border border-border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-textcolor-primary">{item.label}</p>
                        {item.supportingText ? (
                          <p className="text-sm text-textcolor-secondary">{item.supportingText}</p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-textcolor-primary">#{item.rank ?? '—'}</p>
                        <p className="text-xs text-textcolor-secondary">{item.valueLabel ?? '—'}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {visibleFields.has('interpretationGuidance') ? (
            <section className="rounded-2xl border border-border bg-background-alt p-5">
              <h3 className="text-lg font-semibold text-textcolor-primary">
                {copy.reportOverview.interpretationGuidance}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-textcolor-secondary">
                {overview.interpretationGuidance.map((item) => (
                  <li key={item} className="rounded-xl border border-border bg-background p-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {visibleFields.has('confidenceStrip') ? (
            <section className="rounded-2xl border border-border bg-background-alt p-5">
              <h3 className="text-lg font-semibold text-textcolor-primary">{copy.reportOverview.confidenceStrip}</h3>
              <div className="mt-4 grid gap-3">
                {overview.confidenceStrip.map((badge) => (
                  <div key={badge.id} className="rounded-xl border border-border bg-background p-3">
                    <ConfidenceIndicator badge={badge} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {overview.hiddenFieldKeys.length > 0 ? (
        <p className="text-sm text-textcolor-secondary">
          {copy.common.hiddenByPolicy}: {overview.hiddenFieldKeys.join(', ')}
        </p>
      ) : null}
    </section>
  )
}
