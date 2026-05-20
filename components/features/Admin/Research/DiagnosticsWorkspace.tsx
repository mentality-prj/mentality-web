'use client'

import { useLocale } from 'next-intl'

import { ConfidenceIndicator, InsightCardPanel } from '@/components/shared/reporting/ReportingPrimitives'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { useMLInspection } from '@/hooks/useMLInspection'
import { Button } from '@/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'

export function DiagnosticsWorkspace() {
  const locale = useLocale()
  const copy = getReportingCopy(locale)
  const inspectionState = useMLInspection()

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-background-alt p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-textcolor-primary">{copy.diagnostics.inspectionTitle}</h2>
          </div>
          <Button variant="secondary" onClick={inspectionState.refresh} disabled={inspectionState.loading}>
            {copy.common.refresh}
          </Button>
        </div>

        {inspectionState.error ? (
          <div className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-xl border p-4 text-sm">
            {inspectionState.error}
          </div>
        ) : null}

        {inspectionState.loading ? (
          <div className="mt-4 h-48 animate-pulse rounded-2xl bg-background" />
        ) : inspectionState.inspection ? (
          <Tabs defaultValue="details" className="mt-4">
            <TabsList variant="grey">
              <TabsTrigger value="details" variant="grey">
                {copy.diagnostics.detailsTab}
              </TabsTrigger>
              <TabsTrigger value="diagnostics" variant="grey">
                {copy.diagnostics.diagnosticsTab}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="grid gap-4 pt-4">
              <div className="grid gap-4 lg:grid-cols-4">
                <InsightCardPanel card={inspectionState.inspection.cards.riskScore} />
                <InsightCardPanel card={inspectionState.inspection.cards.anomaly} />
                <InsightCardPanel card={inspectionState.inspection.cards.probability} />
                <InsightCardPanel card={inspectionState.inspection.cards.modelVersion} />
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
                  {copy.diagnostics.auditTrail}
                </h3>
                {inspectionState.inspection.details.length > 0 ? (
                  <div className="mt-4 grid gap-3">
                    {inspectionState.inspection.details.map((detail) => (
                      <details key={detail.id} className="rounded-xl border border-border bg-background-alt p-3">
                        <summary className="cursor-pointer font-medium text-textcolor-primary">{detail.title}</summary>
                        <div className="mt-2 text-sm text-textcolor-secondary">
                          <p>{detail.text}</p>
                          {detail.supportingText ? <p className="mt-1">{detail.supportingText}</p> : null}
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-textcolor-secondary">{copy.common.noData}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="diagnostics" className="grid gap-4 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-border bg-background p-4">
                <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
                  {copy.diagnostics.policySummary}
                </h3>
                {inspectionState.inspection.diagnostics.length > 0 ? (
                  <dl className="mt-4 grid gap-3 md:grid-cols-2">
                    {inspectionState.inspection.diagnostics.map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-background-alt p-3">
                        <dt className="text-xs tracking-wide text-textcolor-secondary">{item.label}</dt>
                        <dd className="mt-1 text-sm font-medium text-textcolor-primary">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 text-sm text-textcolor-secondary">{copy.common.unavailableDiagnostics}</p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
                  {copy.common.confidence}
                </h3>
                {inspectionState.inspection.confidence ? (
                  <div className="mt-4">
                    <ConfidenceIndicator badge={inspectionState.inspection.confidence} />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-textcolor-secondary">{copy.common.unavailableDiagnostics}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : inspectionState.error ? null : (
          <p className="mt-4 text-sm text-textcolor-secondary">{copy.common.noData}</p>
        )}
      </section>
    </div>
  )
}
