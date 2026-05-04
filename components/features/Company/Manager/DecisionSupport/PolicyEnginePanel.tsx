'use client'

import { useTranslations } from 'next-intl'

import { normalizeDecisionSupportConfidence } from '@/helpers/decisionSupport.helpers'
import { useAdminPolicyEngine } from '@/hooks/useAdminPolicyEngine'
import { Button } from '@/ui/button'

function MetricItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-textcolor-secondary">{label}</p>
      <p className="mt-1 text-lg font-semibold text-textcolor-primary">{value ?? '—'}</p>
    </div>
  )
}

export function PolicyEnginePanel() {
  const t = useTranslations('pages.Company.manager.decisionSupport.policyEngine')
  const { metrics, audit, loading, error, refresh } = useAdminPolicyEngine()

  return (
    <div className="mt-6 rounded-2xl border border-border bg-background-alt p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{t('title')}</h3>
        <Button size="small" variant="secondary" onClick={refresh} disabled={loading}>
          {t('refresh')}
        </Button>
      </div>

      {error && (
        <div className="border-destructive/30 bg-destructive/10 mt-4 rounded-xl border p-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-background-muted" />
          ))}
        </div>
      ) : metrics ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <MetricItem label={t('metrics.total')} value={metrics.totalRiskEvents} />
          <MetricItem label={t('metrics.active')} value={metrics.activeCount} />
          <MetricItem label={t('metrics.escalating')} value={metrics.escalatingCount} />
          <MetricItem label={t('metrics.resolved')} value={metrics.resolvedCount} />
          <MetricItem label={t('metrics.suppressed')} value={metrics.suppressedCount} />
          <MetricItem
            label={t('metrics.avgConfidence')}
            value={(() => {
              const normalized = normalizeDecisionSupportConfidence(metrics.averageConfidence ?? null)
              return normalized == null ? null : `${Math.round(normalized * 100)}%`
            })()}
          />
        </div>
      ) : null}

      <div className="mt-6">
        <h4 className="text-sm font-semibold">{t('audit.title')}</h4>
        {loading ? (
          <p className="mt-2 text-sm text-textcolor-secondary">{t('audit.loading')}</p>
        ) : audit.length === 0 ? (
          <p className="mt-2 text-sm text-textcolor-secondary">{t('audit.empty')}</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-textcolor-secondary">
                  <th className="py-2 pr-4">{t('audit.columns.performedAt')}</th>
                  <th className="py-2 pr-4">{t('audit.columns.action')}</th>
                  <th className="py-2 pr-4">{t('audit.columns.performedBy')}</th>
                  <th className="py-2 pr-4">{t('audit.columns.companyId')}</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((entry, i) => (
                  <tr key={entry.id ?? i} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-4 text-textcolor-secondary">
                      {(() => {
                        if (!entry.performedAt) return '—'
                        const d = new Date(entry.performedAt)
                        return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString()
                      })()}
                    </td>
                    <td className="py-2 pr-4 font-medium text-textcolor-primary">{entry.action ?? '—'}</td>
                    <td className="py-2 pr-4 text-textcolor-secondary">{entry.performedBy ?? '—'}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-textcolor-secondary">{entry.companyId ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
