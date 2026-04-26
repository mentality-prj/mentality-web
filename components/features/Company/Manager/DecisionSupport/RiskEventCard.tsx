'use client'

import { useLocale, useTranslations } from 'next-intl'

import { RiskEventEvidenceSection } from '@/components/features/Company/CompanyAdmin/DecisionSupport/RiskEventEvidenceSection'
import Card from '@/components/shared/Cards/Card'
import { DecisionSupportRiskEvent } from '@/types/decisionSupport'
import { Button } from '@/ui/button'

import { formatEur, formatMappedValue } from './helpers'

type Props = {
  event: DecisionSupportRiskEvent
  companyId: string | null
  isExpanded: boolean
  isProcessing: boolean
  onToggleEvidence: (eventId: string) => void
  onMarkAddressed: (eventId: string) => Promise<void>
}

export function RiskEventCard({
  event,
  companyId,
  isExpanded,
  isProcessing,
  onToggleEvidence,
  onMarkAddressed,
}: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')
  const locale = useLocale()

  return (
    <Card title={event.title}>
      <dl className="mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex gap-1">
          <dt className="font-medium">{t('lifecycle.severity')}:</dt>
          <dd>{formatMappedValue(event.severity, t, 'values.level')}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('lifecycle.priority')}:</dt>
          <dd>{formatMappedValue(event.priority, t, 'values.level')}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('lifecycle.occurrenceCount')}:</dt>
          <dd>{event.occurrenceCount ?? '—'}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('lifecycle.lastSeenAt')}:</dt>
          <dd>{event.lastSeenAt || '—'}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('lifecycle.estimatedImpactEur')}:</dt>
          <dd>{formatEur(event.estimatedImpactEur ?? null, t, locale)}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => onToggleEvidence(event.id)}>
          {isExpanded ? t('lifecycle.hideEvidence') : t('lifecycle.showEvidence')}
        </Button>
        <Button type="button" onClick={() => onMarkAddressed(event.id)} disabled={isProcessing}>
          {t('actions.markAddressed')}
        </Button>
      </div>
      {isExpanded && companyId && (
        <div className="mt-3">
          <RiskEventEvidenceSection companyId={companyId} eventId={event.id} />
        </div>
      )}
    </Card>
  )
}
