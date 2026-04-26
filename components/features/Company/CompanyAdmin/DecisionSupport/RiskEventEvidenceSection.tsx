'use client'

import { useTranslations } from 'next-intl'

import { useRiskEventEvidence } from '@/hooks/useRiskEventEvidence'
import { GranularityLevel } from '@/types/decisionSupport'

interface RiskEventEvidenceSectionProps {
  companyId: string
  eventId: string
}

const GRANULARITY_CONFIG: Record<GranularityLevel, { labelKey: string; colorClass: string; iconClass: string }> = {
  full: {
    labelKey: 'granularity.full',
    colorClass: 'text-green-600',
    iconClass: 'bg-green-100',
  },
  reduced: {
    labelKey: 'granularity.reduced',
    colorClass: 'text-yellow-600',
    iconClass: 'bg-yellow-100',
  },
  'baseline-only': {
    labelKey: 'granularity.baselineOnly',
    colorClass: 'text-orange-600',
    iconClass: 'bg-orange-100',
  },
  'insufficient-data': {
    labelKey: 'granularity.insufficientData',
    colorClass: 'text-destructive',
    iconClass: 'bg-destructive/10',
  },
}

export function RiskEventEvidenceSection({ companyId, eventId }: RiskEventEvidenceSectionProps) {
  const t = useTranslations('components.RiskEventEvidenceSection')
  const { evidence, loading, error } = useRiskEventEvidence(companyId, eventId)
  const titleId = `evidence-section-title-${eventId}`

  if (loading) {
    return (
      <div
        className="bg-muted animate-pulse rounded-lg p-4"
        style={{ height: '180px' }}
        aria-label={t('ariaLoading')}
        role="status"
      />
    )
  }

  if (error) {
    return (
      <div className="bg-muted/40 rounded-lg border border-border p-4 text-sm text-textcolor-secondary">
        {t('requestError')}
      </div>
    )
  }

  if (!evidence) {
    return (
      <div className="bg-muted/40 rounded-lg border border-border p-4 text-sm text-textcolor-secondary">
        {t('errorFallback')}
      </div>
    )
  }

  const granularityConfig = GRANULARITY_CONFIG[evidence.granularityLevel]
  const improvedPct = Math.round(evidence.improvedRateAmongEvaluated * 100)
  const upliftPct = evidence.uplift != null ? Math.round(evidence.uplift * 100) : null
  const upliftLabel =
    upliftPct != null ? new Intl.NumberFormat(undefined, { signDisplay: 'always' }).format(upliftPct) : null
  const withActionPct = evidence.uplift != null ? Math.round(evidence.improvedRateAmongEvaluated * 100) : null
  const withoutActionPct =
    evidence.uplift != null && withActionPct != null ? withActionPct - Math.round(evidence.uplift * 100) : null

  return (
    <section className="bg-card rounded-lg border border-border p-4" aria-labelledby={titleId}>
      <h3 id={titleId} className="mb-3 text-sm font-semibold text-textcolor-primary">
        {t('title')}
      </h3>

      <div className="flex flex-col gap-3">
        {/* Confidence indicator */}
        <div
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-medium ${granularityConfig.iconClass} ${granularityConfig.colorClass}`}
          aria-label={`${t('ariaConfidence')}: ${t(granularityConfig.labelKey)}`}
        >
          {t(granularityConfig.labelKey)}
        </div>

        {/* Stats grid */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-textcolor-secondary">{t('stats.similarCases')}</dt>
            <dd className="font-medium">{evidence.rawN.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-textcolor-secondary">{t('stats.effectiveN')}</dt>
            <dd className="font-medium">{evidence.effectiveN.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-textcolor-secondary">{t('stats.improvedRate')}</dt>
            <dd className="font-medium">{improvedPct}%</dd>
          </div>
          <div>
            <dt className="text-xs text-textcolor-secondary">{t('stats.dataCoverage')}</dt>
            <dd className="font-medium">{evidence.dataCoverageScore}%</dd>
          </div>
        </dl>

        {/* Uplift block — hidden in descriptiveOnly mode */}
        {!evidence.descriptiveOnly && upliftPct != null && (
          <div className="rounded-md bg-primary/5 px-3 py-2">
            <p className="text-sm font-semibold text-primary" aria-label={t('ariaUplift')}>
              {t('uplift.label')}: {upliftLabel}%
            </p>
            {withActionPct != null && withoutActionPct != null && (
              <p className="mt-0.5 text-xs text-textcolor-secondary">
                {t('uplift.withAction')}: {withActionPct}% &nbsp;·&nbsp;{t('uplift.withoutAction')}: {withoutActionPct}%
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        {evidence.summary && <p className="text-sm text-textcolor-secondary">{evidence.summary}</p>}
      </div>
    </section>
  )
}
