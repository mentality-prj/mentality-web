'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import {
  advanceOperatorLeadStage,
  completeOperatorLeadFollowUp,
  getOperatorLead,
  getOperatorLeadSummary,
  type LeadNextAction,
  listOperatorLeads,
  planOperatorLeadFollowUp,
} from '@/helpers/api-wrapper'
import { SectionCard } from '@/ds/components/SectionCard'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Input } from '@/ui/input'
import { NativeSelect } from '@/ui/native-select'

type Category = 'business' | 'research'
type Stage = 'inquiry' | 'qualified' | 'demo' | 'pilot' | 'decision' | 'won' | 'lost' | 'closed'

type LeadSummary = {
  _id: string
  category: Category
  createdAt?: string
  companyName?: string
  institutionName?: string
  teamSize?: string
  interest?: string
  researchInterest?: string
  leadStage?: Stage
  followUpOn?: string
  nextAction?: LeadNextAction
}

type PipelineSummary = {
  category: Category
  total: number
  due: number
  asOfDate: string
  stages: Record<Stage, number>
}

type LeadDetail = LeadSummary & {
  name: string
  email: string
  message?: string
  businessRole?: string
  researchTopic?: string
  contactConsentAt?: string
  leadStageHistory?: Array<{ from: Stage; to: Stage; changedAt: string }>
  followUpRevision?: number
  followUpHistory?: Array<{
    action: LeadNextAction
    outcome: 'contacted' | 'no_response'
    dueOn: string
    completedAt: string
  }>
}

const NEXT_STAGES: Record<Stage, readonly Stage[]> = {
  inquiry: ['qualified', 'closed'],
  qualified: ['demo', 'closed'],
  demo: ['pilot', 'closed'],
  pilot: ['decision', 'closed'],
  decision: ['won', 'lost', 'closed'],
  won: [],
  lost: [],
  closed: [],
}

const LEAD_ID = /^[a-fA-F0-9]{24}$/
const NEXT_ACTIONS: LeadNextAction[] = ['reply', 'schedule_demo', 'prepare_pilot', 'review_decision']
const panel = 'border-outline-secondary rounded-2xl border bg-white p-5'
const action = 'min-h-11 disabled:opacity-50'

/**
 * No lead email/message in the list request. Read an individual record only
 * after an explicit operator action; NestJS verifies the user on every call.
 */
export function LeadOperatorConsole() {
  const t = useTranslations('pages.LeadPipeline')
  const [category, setCategory] = useState<Category>('business')
  const accessRevoked = useRef(false)
  const [summary, setSummary] = useState<PipelineSummary | null>(null)
  const [summaryRevision, setSummaryRevision] = useState(0)
  const [leads, setLeads] = useState<LeadSummary[]>([])
  const [selected, setSelected] = useState<LeadDetail | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dueOnly, setDueOnly] = useState(false)
  const [followUpOn, setFollowUpOn] = useState('')
  const [nextAction, setNextAction] = useState<LeadNextAction>('reply')

  useEffect(() => {
    const abort = new AbortController()
    setSelected(null)
    setLeads([])
    setError(accessRevoked.current ? t('unavailable') : null)
    if (accessRevoked.current) return () => abort.abort()
    setBusy(true)

    void listOperatorLeads(category, dueOnly)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            accessRevoked.current = true
            setSelected(null)
            setLeads([])
            setSummary(null)
          }
          throw new Error('Operator list unavailable')
        }
        const payload: unknown = await response.json()
        if (!Array.isArray(payload)) throw new Error('Invalid lead list')
        if (!abort.signal.aborted && !accessRevoked.current) setLeads(payload as LeadSummary[])
      })
      .catch(() => {
        if (!abort.signal.aborted) setError(t('unavailable'))
      })
      .finally(() => {
        if (!abort.signal.aborted) setBusy(false)
      })

    return () => abort.abort()
  }, [category, dueOnly, t])

  useEffect(() => {
    let cancelled = false
    setSummary(null)
    if (accessRevoked.current) {
      return () => {
        cancelled = true
      }
    }
    void getOperatorLeadSummary(category)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            accessRevoked.current = true
            setSelected(null)
            setLeads([])
            setSummary(null)
            setError(t('unavailable'))
          }
          return
        }
        const body: unknown = await response.json()
        if (
          body &&
          typeof body === 'object' &&
          'category' in body &&
          body.category === category &&
          'total' in body &&
          typeof body.total === 'number' &&
          'due' in body &&
          typeof body.due === 'number' &&
          'stages' in body &&
          body.stages &&
          typeof body.stages === 'object'
        ) {
          if (!cancelled && !accessRevoked.current) setSummary(body as PipelineSummary)
        }
      })
      .catch(() => {
        // The lead list remains usable if the summary endpoint is unavailable.
      })
    return () => {
      cancelled = true
    }
  }, [category, summaryRevision, t])

  const clearSensitiveLeadData = () => {
    // An expired/revoked operator session must not leave previously fetched
    // names, emails, messages or pipeline metadata visible in this screen.
    setSelected(null)
    setLeads([])
    setSummary(null)
    setFollowUpOn('')
    setNextAction('reply')
  }

  const openLead = async (leadId: string) => {
    if (!LEAD_ID.test(leadId) || accessRevoked.current) return
    setBusy(true)
    setError(null)
    let accessDenied = false
    try {
      const response = await getOperatorLead(leadId)
      if (!response.ok) {
        accessDenied = response.status === 401 || response.status === 403
        throw new Error('Operator detail unavailable')
      }
      const detail = (await response.json()) as LeadDetail
      if (accessRevoked.current) return
      if (detail._id !== leadId || detail.category !== category) throw new Error('Mismatched detail')
      setSelected(detail)
      setFollowUpOn(detail.followUpOn || '')
      setNextAction(detail.nextAction || 'reply')
    } catch {
      if (accessDenied) accessRevoked.current = true
      if (accessRevoked.current) {
        clearSensitiveLeadData()
      } else {
        setSelected(null)
      }
      setError(t('unavailable'))
    } finally {
      setBusy(false)
    }
  }

  /**
   * A successful PATCH is already committed. A subsequent GET can fail on its
   * own; never relabel that read failure as a write conflict (which could cause
   * an operator to repeat a completed contact or stage transition).
   */
  const refreshAfterMutation = async (leadId: string) => {
    try {
      const [detailResponse, listResponse] = await Promise.all([
        getOperatorLead(leadId),
        listOperatorLeads(category, dueOnly),
      ])
      if (
        detailResponse.status === 401 ||
        detailResponse.status === 403 ||
        listResponse.status === 401 ||
        listResponse.status === 403
      ) {
        accessRevoked.current = true
        clearSensitiveLeadData()
        setError(t('unavailable'))
        return
      }
      if (accessRevoked.current) return
      if (!detailResponse.ok || !listResponse.ok) throw new Error('Lead refresh unavailable')
      const [detail, list]: [LeadDetail, unknown] = await Promise.all([detailResponse.json(), listResponse.json()])
      if (accessRevoked.current) return
      if (detail._id !== leadId || detail.category !== category || !Array.isArray(list)) {
        throw new Error('Invalid lead refresh response')
      }
      setSelected(detail)
      setFollowUpOn(detail.followUpOn || '')
      setNextAction(detail.nextAction || 'reply')
      setLeads(list as LeadSummary[])
      setSummaryRevision((previous) => previous + 1)
    } catch {
      // The previous detail and queue may be stale after the committed write.
      clearSensitiveLeadData()
      setError(t('unavailable'))
    }
  }

  const advance = async (nextStage: Stage) => {
    if (accessRevoked.current || !selected || !LEAD_ID.test(selected._id)) return
    setBusy(true)
    setError(null)
    const expectedStage = selected.leadStage || 'inquiry'
    try {
      const response = await advanceOperatorLeadStage(selected._id, expectedStage, nextStage)
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          accessRevoked.current = true
          clearSensitiveLeadData()
        }
        setError(t(response.status === 409 ? 'conflict' : 'unavailable'))
        return
      }
      await refreshAfterMutation(selected._id)
    } catch {
      // A transport failure is not proof of an optimistic concurrency conflict.
      setError(t('unavailable'))
    } finally {
      setBusy(false)
    }
  }

  const saveFollowUp = async (clear = false) => {
    if (accessRevoked.current || !selected || !LEAD_ID.test(selected._id) || (!clear && !followUpOn)) return
    setBusy(true)
    setError(null)
    try {
      const response = await planOperatorLeadFollowUp(
        selected._id,
        selected.leadStage || 'inquiry',
        selected.followUpRevision || 0,
        clear ? null : followUpOn,
        clear ? null : nextAction
      )
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          accessRevoked.current = true
          clearSensitiveLeadData()
        }
        setError(t(response.status === 409 ? 'conflict' : 'unavailable'))
        return
      }
      await refreshAfterMutation(selected._id)
    } catch {
      // A transport failure is not proof of an optimistic concurrency conflict.
      setError(t('unavailable'))
    } finally {
      setBusy(false)
    }
  }

  const recordContactOutcome = async (outcome: 'contacted' | 'no_response') => {
    if (accessRevoked.current || !selected || !LEAD_ID.test(selected._id) || !selected.followUpOn) return
    const noResponse = outcome === 'no_response'
    if (noResponse && (!followUpOn || followUpOn <= new Date().toISOString().slice(0, 10))) {
      setError(t('futureFollowUpRequired'))
      return
    }
    setBusy(true)
    setError(null)
    try {
      const response = await completeOperatorLeadFollowUp(
        selected._id,
        selected.leadStage || 'inquiry',
        selected.followUpRevision || 0,
        outcome,
        noResponse ? followUpOn : null,
        noResponse ? nextAction : null
      )
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          accessRevoked.current = true
          clearSensitiveLeadData()
        }
        setError(t(response.status === 409 ? 'conflict' : 'unavailable'))
        return
      }
      await refreshAfterMutation(selected._id)
    } catch {
      // A transport failure is not proof of an optimistic concurrency conflict.
      setError(t('unavailable'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="lead-pipeline-heading">
      <div>
        <h1 id="lead-pipeline-heading" className="text-2xl font-semibold">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-textcolor-secondary">{t('description')}</p>
      </div>

      <label className="flex w-fit flex-col gap-2 text-sm font-medium">
        {t('category')}
        <NativeSelect
          className="min-h-11 w-auto"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          disabled={busy}
        >
          <option value="business">{t('business')}</option>
          <option value="research">{t('research')}</option>
        </NativeSelect
      </label>

      {summary && (
        <section aria-label={t('pipelineOverview')} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(
            [
              ['totalLeads', summary.total],
              ['stages.qualified', summary.stages.qualified],
              ['stages.pilot', summary.stages.pilot],
              ['stages.won', summary.stages.won],
              ['dueLeads', summary.due],
            ] as const
          ).map(([key, count]) => (
            <SectionCard key={key} className="border-outline-secondary rounded-xl border bg-white px-3 py-3">
              <span className="block text-xs text-textcolor-secondary">{t(key)}</span>
              <strong className="mt-1 block text-xl tabular-nums">{count}</strong>
            </SectionCard>
          ))}
        </section>
      )}

      <label className="flex w-fit items-center gap-2 text-sm">
        <Checkbox
          checked={dueOnly}
          onCheckedChange={(checked) => setDueOnly(checked === true)}
          disabled={busy}
        />
        {t('dueOnly')}
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {busy && (
        <p role="status" className="text-sm">
          {t('loading')}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <SectionCard className={panel}>
          <h2 className="text-lg font-semibold">{t('incoming')}</h2>
          {!busy && !error && leads.length === 0 && <p className="mt-3 text-sm">{t('empty')}</p>}
          <ul className="mt-4 space-y-2">
            {leads.map((lead) => (
              <li key={lead._id}>
                <Button
                  type="button"
                  variant="secondary"
                  size="medium"
                  disabled={busy}
                  className="h-auto min-h-11 w-full flex-col items-start whitespace-normal rounded-xl p-3 text-left"
                  onClick={() => void openLead(lead._id)}
                >
                  <span className="block font-medium">{lead.companyName || lead.institutionName || t('unnamed')}</span>
                  <span className="mt-1 block text-xs text-textcolor-secondary">
                    {t(`stages.${lead.leadStage || 'inquiry'}`)}
                    {lead.createdAt ? ` · ${new Date(lead.createdAt).toLocaleDateString()}` : ''}
                    {lead.followUpOn ? ` · ${t('followUpOn')}: ${lead.followUpOn}` : ''}
                  </span>
                </Button
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard className={panel}>
          <h2 className="text-lg font-semibold">{t('detail')}</h2>
          {!selected ? (
            <p className="mt-3 text-sm text-textcolor-secondary">{t('choose')}</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              <p className="font-semibold">{selected.companyName || selected.institutionName || t('unnamed')}</p>
              <p className="text-sm">{selected.name}</p>
              <a
                className="w-fit break-all text-sm text-primary underline underline-offset-4"
                href={`mailto:${selected.email}`}
              >
                {selected.email}
              </a>
              {selected.researchTopic && <p className="text-sm">{selected.researchTopic}</p>}
              {selected.message && <p className="whitespace-pre-wrap text-sm">{selected.message}</p>}
              <p className="text-sm">
                {t('stage')}: <strong>{t(`stages.${selected.leadStage || 'inquiry'}`)}</strong>
              </p>
              <fieldset className="flex flex-col gap-3 rounded-xl border border-[var(--outline-secondary)] p-4">
                <legend className="px-2 text-sm font-semibold">{t('followUpHeading')}</legend>
                <label className="flex flex-col gap-1 text-sm">
                  {t('nextAction')}
                  <NativeSelect
                    className="min-h-11"
                    value={nextAction}
                    onChange={(event) => setNextAction(event.target.value as LeadNextAction)}
                    disabled={busy}
                  >
                    {NEXT_ACTIONS.map((actionName) => (
                      <option key={actionName} value={actionName}>
                        {t(`actions.${actionName}`)}
                      </option>
                    ))}
                  </NativeSelect
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  {t('followUpOn')}
                  <Input
                    type="date"
                    value={followUpOn}
                    onChange={(event) => setFollowUpOn(event.target.value)}
                    className="min-h-11"
                    disabled={busy}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" size="medium" className={action} disabled={busy || !followUpOn} onClick={() => void saveFollowUp()}>
                    {t('saveFollowUp')}
                  </Button
                  {selected.followUpOn && (
                    <Button type="button" variant="secondary" size="medium" className={action} disabled={busy} onClick={() => void saveFollowUp(true)}>
                      {t('clearFollowUp')}
                    </Button
                  )}
                  {selected.followUpOn && (
                    <div className="flex flex-col gap-2 border-t border-[var(--outline-secondary)] pt-3">
                      <p className="text-sm font-medium">{t('recordContactOutcome')}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="medium"
                          className={action}
                          disabled={busy}
                          onClick={() => void recordContactOutcome('contacted')}
                        >
                          {t('contacted')}
                        </Button
                        <Button
                          type="button"
                          variant="secondary"
                          size="medium"
                          className={action}
                          disabled={busy || !followUpOn || followUpOn <= new Date().toISOString().slice(0, 10)}
                          onClick={() => void recordContactOutcome('no_response')}
                        >
                          {t('noResponseReschedule')}
                        </Button
                      </div>
                      <p className="text-xs text-textcolor-secondary">{t('manualOutcomeNotice')}</p>
                    </div>
                  )}
                </div>
              </fieldset>
              <div className="flex flex-wrap gap-2">
                {NEXT_STAGES[selected.leadStage || 'inquiry'].map((nextStage) => (
                  <Button key={nextStage} type="button" variant="secondary" size="medium" className={action} disabled={busy} onClick={() => void advance(nextStage)}>
                    {t('moveTo', { stage: t(`stages.${nextStage}`) })}
                  </Button
                ))}
              </div>
              {selected.followUpHistory && selected.followUpHistory.length > 0 && (
                <section aria-label={t('contactHistory')} className="border-t border-[var(--outline-secondary)] pt-3">
                  <h3 className="text-sm font-semibold">{t('contactHistory')}</h3>
                  <ul className="mt-2 space-y-1 text-xs text-textcolor-secondary">
                    {selected.followUpHistory
                      .slice(-5)
                      .reverse()
                      .map((item, index) => (
                        <li key={index}>
                          {t(`outcomes.${item.outcome}`)} · {t(`actions.${item.action}`)} ·{' '}
                          {new Date(item.completedAt).toLocaleDateString()}
                        </li>
                      ))}
                  </ul>
                </section>
              )}
              <p className="text-xs text-textcolor-secondary">{t('private')}</p>
            </div>
          )}
        </SectionCard>
      </div>
    </section>
  )
}
