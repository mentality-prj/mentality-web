'use client'

import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { InfoBanner } from '@/ds/components/InfoBanner'
import { DecisionSupportExecutiveSummary } from '@/types/decisionSupport'

import { formatConfidenceValue, formatMappedValue, overallStatusToCardType } from './helpers'

type Props = {
  executiveSummary: DecisionSupportExecutiveSummary | null | undefined
}

function overallStatusToIcon(status: string | null | undefined) {
  const cls = 'text-white opacity-50'
  switch (status?.toLowerCase()) {
    case 'stable':
    case 'normal':
      return <CheckCircle size={32} className={cls} />
    case 'elevated':
      return <AlertTriangle size={32} className={cls} />
    case 'high':
    case 'critical':
      return <AlertCircle size={32} className={cls} />
    default:
      return <Info size={32} className={cls} />
  }
}

export function ExecutiveSummaryCard({ executiveSummary }: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')

  return (
    <InfoBanner
      type={overallStatusToCardType(executiveSummary?.overallStatus)}
      icon={overallStatusToIcon(executiveSummary?.overallStatus)}
      label={t('executiveSummary.title')}
      title={executiveSummary?.headline || '—'}
      description={
        <p>
          {t('executiveSummary.status')}:{' '}
          {formatMappedValue(executiveSummary?.overallStatus ?? null, t, 'values.status')}
        </p>
      }
      hint={`${t('executiveSummary.confidence')}: ${formatConfidenceValue(executiveSummary?.confidence, t)}`}
    />
  )
}
