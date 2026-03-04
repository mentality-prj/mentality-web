'use client'

import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { calculateMentalityIndex } from '@/helpers/phq9.helpers'
import { Phq9ApiResponse, Phq9Severity } from '@/types/phq9'
import { Statuses, StatusType } from '@/types/status.types'

const severityCardMap: Record<Phq9Severity, StatusType> = {
  minimal: 'success',
  mild: 'info',
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

const mockResults: Phq9ApiResponse[] = [
  { score: 1, severity: 'minimal', aiSummary: null, crisisNotice: null, submittedAt: new Date().toISOString() },
  { score: 7, severity: 'mild', aiSummary: null, crisisNotice: null, submittedAt: new Date().toISOString() },
  { score: 12, severity: 'moderate', aiSummary: null, crisisNotice: null, submittedAt: new Date().toISOString() },
  {
    score: 17,
    severity: 'moderately-severe',
    aiSummary: null,
    crisisNotice: null,
    submittedAt: new Date().toISOString(),
  },
  { score: 24, severity: 'severe', aiSummary: null, crisisNotice: null, submittedAt: new Date().toISOString() },
]

export default function AdminPhq9Page() {
  const t = useTranslations('pages.MentalCheck')

  return (
    <div className="flex flex-col gap-default">
      <h2 className="text-xl font-semibold text-textcolor-primary">{t('admin.resultCardsHeading')}</h2>

      <div className="grid gap-default laptop:grid-cols-2">
        {mockResults.map((result) => {
          const mentalityIndex = calculateMentalityIndex(result.score)
          const cardType = severityCardMap[result.severity]
          const cardBorder = severityBorderMap[result.severity]

          return (
            <div key={result.severity} className="flex flex-col gap-xs">
              <p className="text-xs font-medium uppercase tracking-wide text-textcolor-secondary">
                {t(`severity.${result.severity}` as Parameters<typeof t>[0])} — score: {result.score}
              </p>
              <Card type={cardType} className={cardBorder}>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-start">
                    <span className="text-5xl font-bold opacity-85">{mentalityIndex}%</span>
                    <span className="mt-1 max-w-[7rem] text-xs font-medium leading-tight opacity-80">
                      {t('result.mentalityIndexLabel')}
                    </span>
                  </div>
                  <div className="h-12 w-px bg-current opacity-30" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                      {t('result.severityLabel')}
                    </span>
                    <span className="text-xl font-semibold opacity-85">
                      {t(`severity.${result.severity}` as Parameters<typeof t>[0])}
                    </span>
                  </div>
                </div>
              </Card>

              {result.severity === 'severe' && (
                <Card type={Statuses.special} text={t('crisisNotice')} className="text-sm tracking-wide" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
