'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import {
  advanceOperatorLeadStage,
  getOperatorLead,
  listOperatorLeads,
  planOperatorLeadFollowUp,
  type LeadNextAction,
} from '@/helpers/api-wrapper'

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

type LeadDetail = LeadSummary & {
  name: string
  email: string
  message?: string
  businessRole?: string
  researchTopic?: string
  contactConsentAt?: string
  leadStageHistory?: Array<{ from: Stage; to: Stage; changedAt: string }>
  followUpRevision?: number
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
const panel = 'rounded-2xl border border-[var(--outline-secondary)] bg-white p-5'
const action =
  'min-h-10 rounded-full border border-[var(--outline-secondary)] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50'

/**
 * No lead email/message in the list request. Read an individual record only
 * after an explicit operator action; NestJS verifies the user on every call.
 */
export function LeadOperatorConsole() {
  const t = useTranslations('pages.LeadPipeline')
  const [category, setCategory] = useState<Category>('business')
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
    setError(null)
    setBusy(true)

    void listOperatorLeads(category, dueOnly)
      .then(async (response) => {
        if (!response.ok) throw new Error('Operator list unavailable')
        const payload: unknown = await response.json()
        if (!Array.isArray(payload)) throw new Error('Invalid lead list')
        if (!abort.signal.aborted) setLeads(payload as LeadSummary[])
      })
      .catch(() => {
        if (!abort.signal.aborted) setError(t('unavailable'))
      })
      .finally(() => {
        if (!abort.signal.aborted) setBusy(false)
      })

    return () => abort.abort()
  }, [category, dueOnly, t])

  const openLead = async (leadId: string) => {
    if (!LEAD_ID.test(leadId)) return
    setBusy(true)
    setError(null)
    try {
      const response = await getOperatorLead(leadId)
      if (!response.ok) throw new Error('Operator detail unavailable')
      const detail = (await response.json()) as LeadDetail
      if (detail._id !== leadId || detail.category !== category) throw new Error('Mismatched detail')
      setSelected(detail)
      setFollowUpOn(detail.followUpOn || '')
      setNextAction(detail.nextAction || 'reply')
    } catch {
      setSelected(null)
      setError(t('unavailable'))
    } finally {
      setBusy(false)
    }
  }

  const advance = async (nextStage: Stage) => {
    if (!selected || !LEAD_ID.test(selected._id)) return
    setBusy(true)
    setError(null)
    const expectedStage = selected.leadStage || 'inquiry'
    try {
      const response = await advanceOperatorLeadStage(selected._id, expectedStage, nextStage)
      if (!response.ok) throw new Error('Stage update rejected')
      await openLead(selected._id)
      const listResponse = await listOperatorLeads(category, dueOnly)
      if (!listResponse.ok) throw new Error('List refresh failed')
      setLeads((await listResponse.json()) as LeadSummary[])
    } catch {
      setError(t('conflict'))
    } finally {
      setBusy(false)
    }
  }

  const saveFollowUp = async (clear = false) => {
    if (!selected || !LEAD_ID.test(selected._id) || (!clear && !followUpOn)) return
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
      if (!response.ok) throw new Error('Follow-up changed')
      await openLead(selected._id)
      const listResponse = await listOperatorLeads(category, dueOnly)
      if (!listResponse.ok) throw new Error('Lead queue refresh failed')
      setLeads((await listResponse.json()) as LeadSummary[])
    } catch {
      setError(t('conflict'))
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
        <select
          className="min-h-11 rounded-lg border border-[var(--outline-secondary)] bg-white px-3"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          disabled={busy}
        >
          <option value="business">{t('business')}</option>
          <option value="research">{t('research')}</option>
        </select>
      </label>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={dueOnly}
          onChange={(event) => setDueOnly(event.target.checked)}
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
        <div className={panel}>
          <h2 className="text-lg font-semibold">{t('incoming')}</h2>
          {!busy && leads.length === 0 && <p className="mt-3 text-sm">{t('empty')}</p>}
          <ul className="mt-4 space-y-2">
            {leads.map((lead) => (
              <li key={lead._id}>
                <button
                  type="button"
                  disabled={busy}
                  className="w-full rounded-xl border border-[var(--outline-secondary)] p-3 text-left focus-visible:outline-2"
                  onClick={() => void openLead(lead._id)}
                >
                  <span className="block font-medium">{lead.companyName || lead.institutionName || t('unnamed')}</span>
                  <span className="mt-1 block text-xs text-textcolor-secondary">
                    {t(`stages.${lead.leadStage || 'inquiry'}`)}
                    {lead.createdAt ? ` · ${new Date(lead.createdAt).toLocaleDateString()}` : ''}
                    {lead.followUpOn ? ` · ${t('followUpOn')}: ${lead.followUpOn}` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={panel}>
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
                  <select
                    className="min-h-10 rounded-lg border border-[var(--outline-secondary)] px-3"
                    value={nextAction}
                    onChange={(event) => setNextAction(event.target.value as LeadNextAction)}
                    disabled={busy}
                  >
                    {NEXT_ACTIONS.map((actionName) => (
                      <option key={actionName} value={actionName}>
                        {t(`actions.${actionName}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  {t('followUpOn')}
                  <input
                    type="date"
                    value={followUpOn}
                    onChange={(event) => setFollowUpOn(event.target.value)}
                    className="min-h-10 rounded-lg border border-[var(--outline-secondary)] px-3"
                    disabled={busy}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className={action} disabled={busy || !followUpOn} onClick={() => void saveFollowUp()}>
                    {t('saveFollowUp')}
                  </button>
                  {selected.followUpOn && (
                    <button className={action} disabled={busy} onClick={() => void saveFollowUp(true)}>
                      {t('clearFollowUp')}
                    </button>
                  )}
                </div>
              </fieldset>
              <div className="flex flex-wrap gap-2">
                {NEXT_STAGES[selected.leadStage || 'inquiry'].map((nextStage) => (
                  <button key={nextStage} className={action} disabled={busy} onClick={() => void advance(nextStage)}>
                    {t('moveTo', { stage: t(`stages.${nextStage}`) })}
                  </button>
                ))}
              </div>
              <p className="text-xs text-textcolor-secondary">{t('private')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
