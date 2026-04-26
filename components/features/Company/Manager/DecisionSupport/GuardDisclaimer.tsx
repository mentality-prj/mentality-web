'use client'

import { useTranslations } from 'next-intl'

import { TestDisclaimer } from '@/components/shared/TestDisclaimer'
import { DecisionSupportAnalyticsGuard } from '@/types/decisionSupport'

import { formatGuardReason } from './helpers'

type Props = {
  analyticsGuard: DecisionSupportAnalyticsGuard
}

export function GuardDisclaimer({ analyticsGuard }: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')

  if (analyticsGuard.reasonCodes.length === 0) return null

  return (
    <TestDisclaimer
      text={
        <>
          <p className="font-medium">{t('guard.title')}</p>
          <p className="mt-1">{t('guard.note')}</p>
          {analyticsGuard.reasonCodes.length === 1 ? (
            <p className="mt-1">{formatGuardReason(analyticsGuard.reasonCodes[0], t)}</p>
          ) : (
            <ul className="mt-1 list-disc pl-5">
              {analyticsGuard.reasonCodes.map((code) => (
                <li key={code}>{formatGuardReason(code, t)}</li>
              ))}
            </ul>
          )}
          {analyticsGuard.interpretationGuidance && <p className="mt-2">{analyticsGuard.interpretationGuidance}</p>}
        </>
      }
    />
  )
}
