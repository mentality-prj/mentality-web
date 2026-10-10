'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { DipConnectionBanner } from '@/components/features/Dip/DipConnectionBanner'
import type { DipConnectionStatus, DipDecisionRecord, DipRuleExecutionTrace } from '@/types/dip'

function decisionColor(decision: string): string {
  const d = decision.toLowerCase()
  if (d.includes('high') || d.includes('critical') || d.includes('deny') || d.includes('reject')) {
    return 'bg-rose-100 text-rose-700'
  }
  if (d.includes('medium') || d.includes('review') || d.includes('warning')) {
    return 'bg-amber-100 text-amber-700'
  }
  if (d.includes('low') || d.includes('allow') || d.includes('approve')) {
    return 'bg-emerald-100 text-emerald-700'
  }
  return 'bg-slate-100 text-slate-600'
}

function formatTimestamp(ts: string, locale: string): string {
  try {
    const intlLocale = locale.startsWith('uk') ? 'uk-UA' : locale.startsWith('pl') ? 'pl-PL' : 'en-US'
    return new Date(ts).toLocaleString(intlLocale, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ts
  }
}

function DecisionDetail({
  record,
  onClose,
  locale,
}: {
  record: DipDecisionRecord
  onClose: () => void
  locale: string
}) {
  const t = useTranslations('pages.Dip')
  const matchedRules = record.rulesExecuted.filter((r) => r.matched)
  const features = Object.entries(record.featuresUsed).slice(0, 8)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end overflow-y-auto bg-black/20 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-xl">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h3 className="font-semibold text-textcolor-primary">{t('decisions.detailTitle')}</h3>
            <p className="mt-0.5 font-mono text-xs text-textcolor-secondary">{record.decisionId}</p>
          </div>
          <button
            type="button"
            aria-label="Close decision details"
            onClick={onClose}
            className="rounded-lg p-1 text-textcolor-secondary hover:text-textcolor-primary"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Decision result */}
          <div className="text-center">
            <span
              className={`inline-block rounded-2xl px-6 py-2 text-lg font-bold uppercase tracking-wide ${decisionColor(record.decision)}`}
            >
              {record.decision}
            </span>
          </div>

          {/* Matched rules */}
          {matchedRules.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-textcolor-secondary">
                {t('decisions.matchedRules')}
              </p>
              <div className="space-y-2">
                {matchedRules.map((rule: DipRuleExecutionTrace) => (
                  <div key={rule.rule} className="flex items-center gap-2 rounded-xl bg-background-alt px-4 py-2">
                    <span className="text-emerald-600">✓</span>
                    <span className="font-mono text-sm text-textcolor-primary">{rule.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features used */}
          {features.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-textcolor-secondary">
                {t('decisions.featuresUsed')}
              </p>
              <div className="space-y-1">
                {features.map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-4 py-1">
                    <span className="font-mono text-xs text-textcolor-secondary">{key}</span>
                    <span className="font-mono text-xs font-medium text-textcolor-primary">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="rounded-xl bg-background-alt px-4 py-3 text-xs text-textcolor-secondary">
            <p>
              {t('decisions.workflow')}: <span className="text-textcolor-primary">{record.workflowName}</span> v
              {record.workflowVersion}
            </p>
            <p className="mt-1">
              {t('decisions.engine')}: <span className="text-textcolor-primary">{record.engineVersion}</span>
            </p>
            <p className="mt-1">{formatTimestamp(record.timestamp, locale)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  decisions: DipDecisionRecord[]
  connection: DipConnectionStatus
}

export function DecisionsView({ decisions, connection }: Props) {
  const [selected, setSelected] = useState<DipDecisionRecord | null>(null)
  const t = useTranslations('pages.Dip')
  const locale = useLocale()

  return (
    <div className="space-y-6">
      <DipConnectionBanner
        connection={connection}
        notConfiguredLabel={t('notConfigured.label')}
        notConfiguredHint={t('notConfigured.hint')}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-textcolor-primary">{t('decisions.recent')}</h2>
          <p className="mt-0.5 text-sm text-textcolor-secondary">
            {decisions.length} {t('decisions.count')}
          </p>
        </div>
      </div>

      {decisions.length === 0 ? (
        <p className="rounded-2xl border border-border bg-background-alt px-5 py-8 text-center text-sm text-textcolor-secondary">
          {t('decisions.empty')}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-background-alt">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('decisions.entity')}</th>
                <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('decisions.workflow')}</th>
                <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('decisions.decision')}</th>
                <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('decisions.rule')}</th>
                <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('common.timestamp')}</th>
                <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">
                  {t('decisions.detailTitle')}
                </th>
              </tr>
            </thead>
            <tbody>
              {decisions.map((rec, index) => (
                <tr
                  key={rec.decisionId}
                  className={`transition-colors hover:bg-background-alt/60 ${
                    index % 2 === 0 ? 'bg-background' : 'bg-background-alt/30'
                  }`}
                >
                  <td className="px-5 py-3 font-mono text-xs text-textcolor-secondary">
                    {rec.entityId ? rec.entityId.slice(0, 8) + '…' : '—'}
                  </td>
                  <td className="px-5 py-3 text-textcolor-primary">{rec.workflowName}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${decisionColor(rec.decision)}`}>
                      {rec.decision}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-textcolor-secondary">{rec.ruleMatched}</td>
                  <td className="px-5 py-3 text-xs text-textcolor-secondary">
                    {formatTimestamp(rec.timestamp, locale)}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setSelected(rec)}
                      aria-label={`${t('decisions.detailTitle')}: ${rec.decisionId}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-textcolor-primary transition-colors hover:bg-background-alt focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {t('decisions.detailTitle')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected ? <DecisionDetail record={selected} onClose={() => setSelected(null)} locale={locale} /> : null}
    </div>
  )
}
