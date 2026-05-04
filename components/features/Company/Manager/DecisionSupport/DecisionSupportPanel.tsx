'use client'

import { useId, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

import { DECISION_SUPPORT_ACTION_OPTIONS } from '@/constants/decisionSupport'
import { normalizeDecisionSupportConfidence } from '@/helpers/decisionSupport.helpers'
import { RiskEventActionType, RiskEventOutcome, RiskEventViewModel } from '@/types/decisionSupport'
import { Button } from '@/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Textarea } from '@/ui/textarea'

import { formatDecisionSupportError } from './helpers'

type Props = {
  riskEvents: RiskEventViewModel[]
  loading: boolean
  processingEventIds: Set<string>
  loadingOutcomeEventIds: Set<string>
  outcomeByEventId: Record<string, RiskEventOutcome | null>
  fetchRiskEventOutcome: (eventId: string) => Promise<RiskEventOutcome | null>
  applyAction: (eventId: string, dto: { actionType: RiskEventActionType; note?: string }) => Promise<boolean>
  resolveRisk: (eventId: string, dto: { note?: string }) => Promise<boolean>
  refresh: () => Promise<void>
  error?: string | null
}

export function filterRiskEventsByControls(
  riskEvents: RiskEventViewModel[],
  severityFilter: string,
  statusFilter: string,
  confidenceFilter: string
): RiskEventViewModel[] {
  return riskEvents.filter((event) => {
    if (severityFilter !== 'all' && (event.severity ?? 'unknown') !== severityFilter) {
      return false
    }

    const normalizedStatus = (event.status ?? 'unknown').toLowerCase()
    if (statusFilter !== 'all' && normalizedStatus !== statusFilter.toLowerCase()) {
      return false
    }

    if (confidenceFilter === 'all') {
      return true
    }

    const confidence = normalizeConfidence(event.confidence)
    if (confidence === null) {
      return confidenceFilter === 'low'
    }

    if (confidenceFilter === 'high') {
      return confidence >= 0.75
    }

    if (confidenceFilter === 'medium') {
      return confidence >= 0.4 && confidence < 0.75
    }

    return confidence < 0.4
  })
}

export function DecisionSupportPanel({
  riskEvents,
  loading,
  processingEventIds,
  loadingOutcomeEventIds,
  outcomeByEventId,
  fetchRiskEventOutcome,
  applyAction,
  resolveRisk,
  refresh,
  error,
}: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confidenceFilter, setConfidenceFilter] = useState('all')
  const [detailsEventId, setDetailsEventId] = useState<string | null>(null)
  const [actionMenuEventId, setActionMenuEventId] = useState<string | null>(null)
  const [resolveNoteByEventId, setResolveNoteByEventId] = useState<Record<string, string>>({})

  const displayError = formatDecisionSupportError(error, t)

  const filteredEvents = useMemo(
    () => filterRiskEventsByControls(riskEvents, severityFilter, statusFilter, confidenceFilter),
    [riskEvents, severityFilter, statusFilter, confidenceFilter]
  )

  const activeOutcome = detailsEventId ? outcomeByEventId[detailsEventId as string] : null

  const onViewDetails = async (eventId: string) => {
    setDetailsEventId(eventId)
    await fetchRiskEventOutcome(eventId)
  }

  const onTakeAction = async (eventId: string, actionType: RiskEventActionType) => {
    const ok = await applyAction(eventId, { actionType })
    if (ok) {
      setActionMenuEventId(null)
      toast.success(t('actionMenu.success'))
    }
  }

  const onResolve = async (eventId: string) => {
    const note = (resolveNoteByEventId[eventId as string] ?? '').trim()
    const ok = await resolveRisk(eventId, { note: note || undefined })

    if (!ok) return

    toast.success(t('resolve.success'))
    setResolveNoteByEventId((prev) => ({ ...prev, [eventId]: '' }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          label={t('filters.severity')}
          value={severityFilter}
          onChange={setSeverityFilter}
          options={[
            { value: 'all', label: t('filters.all') },
            { value: 'critical', label: t('values.level.critical') },
            { value: 'high', label: t('values.level.high') },
            { value: 'medium', label: t('values.level.medium') },
            { value: 'low', label: t('values.level.low') },
          ]}
        />
        <FilterSelect
          label={t('filters.status')}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: t('filters.all') },
            { value: 'active', label: t('values.riskStatus.active') },
            { value: 'resolved', label: t('values.riskStatus.resolved') },
            { value: 'worsened', label: t('values.riskStatus.worsened') },
            { value: 'escalating', label: t('values.riskStatus.escalating') },
            { value: 'suppressed', label: t('values.riskStatus.suppressed') },
          ]}
        />
        <FilterSelect
          label={t('filters.confidence')}
          value={confidenceFilter}
          onChange={setConfidenceFilter}
          options={[
            { value: 'all', label: t('filters.all') },
            { value: 'high', label: t('values.confidence.high') },
            { value: 'medium', label: t('values.confidence.medium') },
            { value: 'low', label: t('values.confidence.low') },
          ]}
        />
      </div>

      {displayError && (
        <div className="border-destructive/30 bg-destructive/10 rounded-xl border p-4">
          <p className="text-destructive text-sm">{displayError}</p>
          <div className="mt-3">
            <Button variant="secondary" onClick={refresh} disabled={loading}>
              {t('retry')}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <RiskDashboardSkeleton />
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background-alt p-6">
          <h3 className="text-lg font-semibold">{t('empty.title')}</h3>
          <p className="mt-1 text-sm text-textcolor-secondary">{t('empty.description')}</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredEvents.map((event) => {
            const isProcessing = processingEventIds.has(event.id)

            return (
              <div key={event.id} className="rounded-2xl border border-border bg-background-alt p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-textcolor-secondary">
                    {t('riskCard.severity')}:{' '}
                    {event.severity ? t(`values.level.${event.severity}` as never) : t('values.na')}
                  </p>
                  <p className="text-xs font-medium text-textcolor-secondary">
                    {t('riskCard.confidence')}: {formatConfidence(event.confidence, t)}
                  </p>
                </div>

                <p className="mt-3 text-sm text-textcolor-primary">{event.explanationShort}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-textcolor-secondary">
                  <span>
                    {t('riskCard.financialRange')}: {event.financialRange ?? t('values.na')}
                  </span>
                  <span>
                    {t('riskCard.status')}: {formatRiskStatus(event.status, t)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="small"
                    onClick={() => setActionMenuEventId((prev) => (prev === event.id ? null : event.id))}
                    disabled={isProcessing}
                    aria-expanded={actionMenuEventId === event.id}
                    aria-controls={`action-menu-${event.id}`}
                  >
                    {t('riskCard.takeAction')}
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => onViewDetails(event.id)}
                    disabled={isProcessing || loadingOutcomeEventIds.has(event.id)}
                  >
                    {t('riskCard.viewDetails')}
                  </Button>
                </div>

                {actionMenuEventId === event.id && (
                  <div
                    id={`action-menu-${event.id}`}
                    className="mt-3 rounded-xl border border-border bg-background p-3"
                  >
                    <p className="mb-2 text-xs font-medium text-textcolor-secondary">{t('actionMenu.title')}</p>
                    <div className="flex flex-wrap gap-2">
                      {DECISION_SUPPORT_ACTION_OPTIONS.map((option) => (
                        <Button
                          key={option.type}
                          size="small"
                          variant="secondary"
                          onClick={() => onTakeAction(event.id, option.type)}
                          disabled={isProcessing}
                        >
                          {t(option.i18nKey as never)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {detailsEventId && (
        <div className="rounded-2xl border border-border bg-background-alt p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">{t('details.title')}</h3>
            <Button size="small" variant="secondary" onClick={() => setDetailsEventId(null)}>
              {t('details.close')}
            </Button>
          </div>

          {loadingOutcomeEventIds.has(detailsEventId) ? (
            <div className="mt-4 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-background-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-background-muted" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-background-muted" />
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <DetailRow
                  label={t('details.status')}
                  value={formatRiskStatus(activeOutcome?.status ?? findRiskStatus(riskEvents, detailsEventId), t)}
                />
                <DetailRow label={t('details.effectSize')} value={formatEffectSize(activeOutcome?.effectSize, t)} />
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold">{t('details.history')}</h4>
                <DetailsList
                  items={(activeOutcome?.history ?? [])
                    .map((item) =>
                      typeof item === 'string'
                        ? item
                        : [item.at, item.description, item.status, item.note].filter(Boolean).join(' - ')
                    )
                    .filter((item) => item.trim().length > 0)}
                  emptyLabel={t('details.noHistory')}
                />
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold">{t('details.performedActions')}</h4>
                <DetailsList
                  items={(activeOutcome?.actions ?? [])
                    .map((item) =>
                      typeof item === 'string'
                        ? item
                        : [item.performedAt, item.label ?? item.type, item.note].filter(Boolean).join(' - ')
                    )
                    .filter((item) => item.trim().length > 0)}
                  emptyLabel={t('details.noActions')}
                />
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold">{t('details.outcome')}</h4>
                <p className="mt-2 text-sm text-textcolor-secondary">
                  {activeOutcome?.outcome || t('details.noOutcome')}
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <p id={`resolve-note-label-${detailsEventId}`} className="text-sm font-semibold">
                  {t('resolve.title')}
                </p>
                <p className="mt-1 text-xs text-textcolor-secondary">{t('resolve.noteHint')}</p>
                <Textarea
                  id={`resolve-note-${detailsEventId}`}
                  aria-labelledby={`resolve-note-label-${detailsEventId}`}
                  aria-label={t('resolve.noteLabel')}
                  className="mt-3"
                  placeholder={t('resolve.notePlaceholder')}
                  value={resolveNoteByEventId[detailsEventId as string] ?? ''}
                  onChange={(event) =>
                    setResolveNoteByEventId((prev) => ({
                      ...prev,
                      [detailsEventId as string]: event.target.value,
                    }))
                  }
                />
                <div className="mt-3">
                  <Button onClick={() => onResolve(detailsEventId)} disabled={processingEventIds.has(detailsEventId)}>
                    {t('resolve.submit')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  const triggerId = useId()
  return (
    <div className="w-full min-w-[180px] max-w-[240px]">
      <p id={triggerId} className="mb-1 text-xs font-medium text-textcolor-secondary">
        {label}
      </p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-labelledby={triggerId}>
          <SelectValue />
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

function RiskDashboardSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border bg-background-alt p-5">
          <div className="h-3 w-2/3 animate-pulse rounded bg-background-muted" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-background-muted" />
          <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-background-muted" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-28 animate-pulse rounded-full bg-background-muted" />
            <div className="h-8 w-28 animate-pulse rounded-full bg-background-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-textcolor-secondary">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function DetailsList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="mt-2 text-sm text-textcolor-secondary">{emptyLabel}</p>
  }

  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-textcolor-secondary">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  )
}

function normalizeConfidence(confidence: number | string | null): number | null {
  return normalizeDecisionSupportConfidence(confidence)
}

function formatConfidence(confidence: number | string | null, t: ReturnType<typeof useTranslations>): string {
  const normalized = normalizeConfidence(confidence)
  if (normalized === null) return t('values.na')
  return `${Math.round(normalized * 100)}%`
}

function formatRiskStatus(status: string | null | undefined, t: ReturnType<typeof useTranslations>): string {
  if (!status) {
    return t('values.na')
  }

  const key = `values.riskStatus.${String(status).toLowerCase()}`
  const translator = t as ReturnType<typeof useTranslations> & { has?: (k: string) => boolean }
  if (typeof translator.has === 'function' && translator.has(key)) {
    return t(key as never)
  }

  return String(status)
}

function formatEffectSize(value: unknown, t: ReturnType<typeof useTranslations>): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toFixed(2)
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  return t('values.na')
}

function findRiskStatus(riskEvents: RiskEventViewModel[], eventId: string): string | null {
  const event = riskEvents.find((item) => item.id === eventId)
  return event?.status ?? null
}
