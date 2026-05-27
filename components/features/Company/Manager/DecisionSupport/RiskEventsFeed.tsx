'use client'

import { useId, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'

import { ConfidenceIndicator, ExplainabilityBlock } from '@/components/shared/reporting/ReportingPrimitives'
import { REPORTING_PRESENTATION_POLICY } from '@/constants/reportingPresentation'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { getRenderableFields } from '@/helpers/reportingVisibility'
import { RiskEventActionKind, RiskEventDetailVM, RiskEventVM, ViewerRole } from '@/types/reporting'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Textarea } from '@/ui/textarea'

type Props = {
  viewerRole: ViewerRole
  mode: 'operational' | 'diagnostics'
  riskEvents: RiskEventVM[]
  loading: boolean
  error: string | null
  processingEventIds: Set<string>
  loadingDetailIds: Set<string>
  detailsByEventId: Record<string, RiskEventDetailVM | null>
  onRetry: () => Promise<void>
  onOpenDetails: (eventId: string) => Promise<RiskEventDetailVM | null>
  onApplyAction?: (eventId: string, dto: { actionType: RiskEventActionKind; note?: string }) => Promise<boolean>
  onResolve?: (eventId: string, dto: { note?: string }) => Promise<boolean>
}

function badgeClasses(tone: 'critical' | 'caution' | 'positive' | 'neutral'): string {
  switch (tone) {
    case 'critical':
      return 'bg-rose-100 text-rose-700'
    case 'caution':
      return 'bg-amber-100 text-amber-700'
    case 'positive':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function riskTone(severity: RiskEventVM['severity']): 'critical' | 'caution' | 'positive' | 'neutral' {
  if (severity === 'critical') return 'critical'
  if (severity === 'high') return 'caution'
  if (severity === 'low') return 'positive'
  return 'neutral'
}

function getRiskLevelLabel(copy: ReturnType<typeof getReportingCopy>, severity: RiskEventVM['severity']): string {
  switch (severity) {
    case 'critical':
      return copy.riskLevels.critical
    case 'high':
      return copy.riskLevels.high
    case 'medium':
      return copy.riskLevels.medium
    case 'low':
      return copy.riskLevels.low
    default:
      return copy.riskLevels.unknown
  }
}

function getRiskStatusLabel(copy: ReturnType<typeof getReportingCopy>, status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return copy.riskStatuses.active
    case 'escalating':
      return copy.riskStatuses.escalating
    case 'resolved':
      return copy.riskStatuses.resolved
    case 'worsened':
      return copy.riskStatuses.worsened
    case 'suppressed':
      return copy.riskStatuses.suppressed
    default:
      return status
  }
}

export function RiskEventsFeed({
  viewerRole,
  mode,
  riskEvents,
  loading,
  error,
  processingEventIds,
  loadingDetailIds,
  detailsByEventId,
  onRetry,
  onOpenDetails,
  onApplyAction,
  onResolve,
}: Props) {
  const locale = useLocale()
  const copy = getReportingCopy(locale)
  const isDiagnostics = mode === 'diagnostics'
  const supportsOperationalActions =
    !isDiagnostics && typeof onApplyAction === 'function' && typeof onResolve === 'function'
  const visibleFields = new Set(
    getRenderableFields(REPORTING_PRESENTATION_POLICY.riskEvent, {
      viewerRole,
      mode,
      aggregateOnly: true,
    })
  )
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confidenceFilter, setConfidenceFilter] = useState('all')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [resolveNote, setResolveNote] = useState('')
  const detailsByEventIdMap = useMemo(
    () => new Map<string, RiskEventDetailVM | null>(Object.entries(detailsByEventId)),
    [detailsByEventId]
  )

  const selectedEvent = riskEvents.find((event) => event.id === selectedEventId) ?? null
  const selectedDetails = selectedEventId ? (detailsByEventIdMap.get(selectedEventId) ?? null) : null
  const showDebugTab = visibleFields.has('details.diagnostics')

  const filteredEvents = useMemo(() => {
    return riskEvents.filter((event) => {
      if (severityFilter !== 'all' && event.severity !== severityFilter) {
        return false
      }
      if (statusFilter !== 'all' && event.status.toLowerCase() !== statusFilter) {
        return false
      }
      if (confidenceFilter !== 'all' && event.confidence.level !== confidenceFilter) {
        return false
      }
      return true
    })
  }, [confidenceFilter, riskEvents, severityFilter, statusFilter])

  const actionOptions: Array<{ type: RiskEventActionKind; label: string }> = [
    { type: 'one_on_one_meeting', label: copy.actions.one_on_one_meeting },
    { type: 'reduce_workload', label: copy.actions.reduce_workload },
    { type: 'team_sync', label: copy.actions.team_sync },
  ]

  return (
    <section className="rounded-2xl border border-border bg-background-alt p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-textcolor-primary">{copy.riskFeed.title}</h2>
          <p className="mt-1 text-sm text-textcolor-secondary">
            {isDiagnostics ? copy.riskFeed.diagnosticsSubtitle : copy.riskFeed.operationalSubtitle}
          </p>
        </div>
        <Button variant="secondary" onClick={onRetry} disabled={loading}>
          {copy.common.refresh}
        </Button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <FilterSelect
          label={copy.riskFeed.severityFilterLabel}
          value={severityFilter}
          onChange={setSeverityFilter}
          placeholder={copy.riskFeed.severity}
          options={[
            { value: 'all', label: copy.common.all },
            { value: 'critical', label: copy.riskLevels.critical },
            { value: 'high', label: copy.riskLevels.high },
            { value: 'medium', label: copy.riskLevels.medium },
            { value: 'low', label: copy.riskLevels.low },
          ]}
        />
        <FilterSelect
          label={copy.riskFeed.statusFilterLabel}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder={copy.riskFeed.status}
          options={[
            { value: 'all', label: copy.common.all },
            { value: 'active', label: copy.riskStatuses.active },
            { value: 'escalating', label: copy.riskStatuses.escalating },
            { value: 'resolved', label: copy.riskStatuses.resolved },
            { value: 'worsened', label: copy.riskStatuses.worsened },
            { value: 'suppressed', label: copy.riskStatuses.suppressed },
          ]}
        />
        <FilterSelect
          label={copy.riskFeed.confidenceFilterLabel}
          value={confidenceFilter}
          onChange={setConfidenceFilter}
          placeholder={copy.riskFeed.confidence}
          options={[
            { value: 'all', label: copy.common.all },
            { value: 'high', label: copy.confidence.levels.high },
            { value: 'medium', label: copy.confidence.levels.medium },
            { value: 'low', label: copy.confidence.levels.low },
            { value: 'unknown', label: copy.confidence.levels.unknown },
          ]}
        />
      </div>

      {isDiagnostics ? (
        <p className="mt-3 text-sm text-textcolor-secondary">{copy.riskFeed.diagnosticsLegend}</p>
      ) : null}

      {error ? (
        <div className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-xl border p-4 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-4 h-48 animate-pulse rounded-2xl bg-background" />
      ) : filteredEvents.length === 0 ? (
        <p className="mt-4 text-sm text-textcolor-secondary">{copy.riskFeed.targetNoEvents}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-wide text-textcolor-secondary">
                <th className="py-3 pr-4">{copy.riskFeed.signal}</th>
                <th className="py-3 pr-4">{copy.riskFeed.severity}</th>
                <th className="py-3 pr-4">{copy.riskFeed.status}</th>
                <th className="py-3 pr-4">{copy.riskFeed.confidence}</th>
                <th className="py-3 pr-4">{copy.riskFeed.recommendedActions}</th>
                <th className="py-3">{copy.riskFeed.details}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-b border-border/60 align-top last:border-0">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-textcolor-primary">{event.title}</p>
                    <p className="mt-1 max-w-md text-textcolor-secondary">{event.summary}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(riskTone(event.severity))}`}
                    >
                      {getRiskLevelLabel(copy, event.severity)}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {getRiskStatusLabel(copy, event.status)}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <ConfidenceIndicator badge={event.confidence} compact />
                  </td>
                  <td className="py-4 pr-4 text-textcolor-secondary">{event.recommendedActions.join(', ')}</td>
                  <td className="py-4">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={async () => {
                        setSelectedEventId(event.id)
                        setResolveNote('')
                        await onOpenDetails(event.id)
                      }}
                    >
                      {copy.riskFeed.details}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={selectedEventId != null} onOpenChange={(open) => (!open ? setSelectedEventId(null) : null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title ?? copy.riskFeed.details}</DialogTitle>
          </DialogHeader>

          {!selectedEvent ? null : loadingDetailIds.has(selectedEvent.id) ? (
            <div className="h-48 animate-pulse rounded-2xl bg-background" />
          ) : (
            <Tabs defaultValue="details">
              <TabsList variant="grey">
                <TabsTrigger value="details" variant="grey">
                  {copy.riskFeed.details}
                </TabsTrigger>
                {showDebugTab ? (
                  <TabsTrigger value="debug" variant="grey">
                    {copy.riskFeed.debug}
                  </TabsTrigger>
                ) : null}
              </TabsList>

              <TabsContent value="details" className="grid gap-4 pt-4">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <ExplainabilityBlock
                    explainability={selectedDetails?.explainability ?? selectedEvent.explainability}
                  />

                  <div className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
                      {copy.riskFeed.recommendedActions}
                    </h3>
                    {!supportsOperationalActions ? (
                      <ul className="mt-4 space-y-2 text-sm text-textcolor-secondary">
                        {selectedEvent.recommendedActions.length > 0 ? (
                          selectedEvent.recommendedActions.map((action) => (
                            <li key={action} className="rounded-xl border border-border bg-background-alt p-3">
                              {action}
                            </li>
                          ))
                        ) : (
                          <li className="rounded-xl border border-border bg-background-alt p-3">
                            {copy.common.noData}
                          </li>
                        )}
                      </ul>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {actionOptions.map((option) => (
                          <Button
                            key={option.type}
                            size="small"
                            onClick={() => onApplyAction?.(selectedEvent.id, { actionType: option.type })}
                            disabled={processingEventIds.has(selectedEvent.id)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 grid gap-3 text-sm text-textcolor-secondary">
                      <p>
                        <span className="font-semibold text-textcolor-primary">{copy.riskFeed.financialRange}: </span>
                        {selectedEvent.financialRange ?? copy.common.notAvailable}
                      </p>
                      <p>
                        <span className="font-semibold text-textcolor-primary">{copy.riskFeed.lastSeenAt}: </span>
                        {selectedEvent.lastSeenAt ?? copy.common.notAvailable}
                      </p>
                      <p>
                        <span className="font-semibold text-textcolor-primary">{copy.riskFeed.effectSize}: </span>
                        {selectedDetails?.effectSizeLabel ?? copy.common.notAvailable}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <InfoListCard title={copy.riskFeed.history} items={selectedDetails?.history ?? []} />
                  <InfoListCard
                    title={copy.riskFeed.performedActions}
                    items={selectedDetails?.performedActions ?? []}
                  />
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
                    {copy.riskFeed.outcome}
                  </h3>
                  <p className="mt-3 text-sm text-textcolor-secondary">
                    {selectedDetails?.outcome ?? copy.common.notAvailable}
                  </p>
                </div>

                {supportsOperationalActions ? (
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
                      {copy.riskFeed.resolveTitle}
                    </h3>
                    <Textarea
                      className="mt-3"
                      value={resolveNote}
                      onChange={(event) => setResolveNote(event.target.value)}
                      placeholder={copy.riskFeed.resolvePlaceholder}
                      aria-label={copy.riskFeed.resolvePlaceholder}
                    />
                    <div className="mt-3">
                      <Button
                        onClick={() => onResolve?.(selectedEvent.id, { note: resolveNote || undefined })}
                        disabled={processingEventIds.has(selectedEvent.id)}
                      >
                        {copy.riskFeed.markResolved}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </TabsContent>

              {showDebugTab ? (
                <TabsContent value="debug" className="pt-4">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">
                      {copy.riskFeed.debug}
                    </h3>
                    {selectedDetails?.diagnostics.length ? (
                      <dl className="mt-4 grid gap-3 md:grid-cols-3">
                        {selectedDetails.diagnostics.map((item) => (
                          <div key={item.label} className="rounded-xl border border-border bg-background-alt p-3">
                            <dt className="text-xs tracking-wide text-textcolor-secondary">{item.label}</dt>
                            <dd className="mt-1 text-sm font-medium text-textcolor-primary">{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="mt-3 text-sm text-textcolor-secondary">{copy.common.unavailableDiagnostics}</p>
                    )}
                  </div>
                </TabsContent>
              ) : null}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: Array<{ value: string; label: string }>
}

function FilterSelect({ label, value, onChange, placeholder, options }: FilterSelectProps) {
  const triggerId = useId()

  return (
    <div className="space-y-2">
      <Label htmlFor={triggerId} className="text-sm font-medium text-textcolor-secondary">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={triggerId} className="min-w-[180px] bg-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function InfoListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm text-textcolor-secondary">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-border bg-background-alt p-3">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-textcolor-secondary">—</p>
      )}
    </div>
  )
}
