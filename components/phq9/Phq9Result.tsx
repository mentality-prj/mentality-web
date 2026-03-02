'use client'

import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { SectionCard } from '@/ds/components/SectionCard'
import { calculateMentalityIndex } from '@/helpers/phq9.helpers'
import { Phq9ApiResponse, Phq9Severity } from '@/types/phq9'
import { Statuses, StatusType } from '@/types/status.types'

interface Phq9ResultProps {
  result: Phq9ApiResponse
}

const severityCardMap: Record<Phq9Severity, StatusType> = {
  minimal: 'success',
  mild: 'success',
  moderate: 'warn',
  'moderately-severe': 'warn',
  severe: 'error',
}

const severityBorderMap: Record<Phq9Severity, string> = {
  minimal: 'border border-inner-white border-border-success',
  mild: 'border border-inner-white border-border-success',
  moderate: 'border border-inner-white border-warning',
  'moderately-severe': 'border border-inner-white border-warning',
  severe: 'border border-inner-white border-border-error',
}

export default function Phq9Result({ result }: Phq9ResultProps) {
  const t = useTranslations('pages.MentalCheck')
  const severityLabel = t(`severity.${result.severity}` as Parameters<typeof t>[0])
  const mentalityIndex = calculateMentalityIndex(result.score)
  const cardType = severityCardMap[result.severity]
  const cardBorder = severityBorderMap[result.severity]

  return (
    <div className="flex flex-col gap-4">
      {/* Score card */}
      <div className="flex">
        <Card type={cardType} className={cardBorder}>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start">
              <span className="text-5xl font-bold">{mentalityIndex}%</span>
              <span className="mt-1 max-w-[7rem] text-xs font-medium leading-tight opacity-80">
                {t('result.mentalityIndexLabel')}
              </span>
            </div>
            <div className="h-12 w-px bg-current opacity-30" />
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                {t('result.severityLabel')}
              </span>
              <span className="text-xl font-semibold">{severityLabel}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI summary */}
      <SectionCard title={t('result.interpretationTitle')}>
        <p className="text-sm leading-relaxed text-textcolor-secondary">
          {result.aiSummary ?? t(`summary.${result.severity}` as Parameters<typeof t>[0])}
        </p>
      </SectionCard>

      {/* Crisis notice */}
      {result.crisisNotice && (
        <Card type={Statuses.special} text={t('crisisNotice')} className="text-sm tracking-wide" />
      )}
    </div>
  )
}
