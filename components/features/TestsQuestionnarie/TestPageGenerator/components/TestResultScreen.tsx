'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'

import { TestResultCard } from '@/components/shared/TestResultCard'
import { SectionCard } from '@/ds/components/SectionCard'
import { StatusType } from '@/types/status.types'

import { ChoiceType, TestConfig } from '../../typesTestPage'
import { BORDER_BY_STATUS } from '../constants/borderByStatus'
import { deriveCardStatus } from '../helpers/deriveCardStatus'
import { TestSubmissionResult } from '../useTestPageForm'

interface TestResultScreenProps<T extends ChoiceType> {
  test: TestConfig<T>
  result: TestSubmissionResult
  isCooldown: boolean
  adminBar?: ReactNode
  onRetry: () => void
}

export function TestResultScreen<T extends ChoiceType>({
  test,
  result,
  isCooldown,
  adminBar,
  onRetry,
}: TestResultScreenProps<T>) {
  const t = useTranslations('components.TestQuestionnaire')
  const resultIndex = test.resultMapping.findIndex(({ min, max }) => result.score >= min && result.score <= max)
  const safeIndex = resultIndex === -1 ? 0 : resultIndex
  const cardType: StatusType =
    test.cardTypeByIndex?.at(safeIndex) ?? deriveCardStatus(safeIndex, test.resultMapping.length)
  const cardBorder = test.cardBorderByIndex?.at(safeIndex) ?? BORDER_BY_STATUS[cardType as StatusType] ?? ''

  const scoreDisplay =
    test.scoreFormat === 'percentage' && test.maxScore
      ? `${Math.round((1 - result.score / test.maxScore) * 100)}%`
      : String(result.score)

  const showAlert =
    result.alertText ||
    (test.staticAlertText && test.alertThreshold !== undefined && result.score >= test.alertThreshold)

  const alertContent = showAlert ? (
    <SectionCard type="note">
      <p className="text-sm leading-relaxed text-textcolor-secondary">{result.alertText ?? test.staticAlertText}</p>
    </SectionCard>
  ) : undefined

  return (
    <>
      {adminBar}
      {isCooldown && (
        <SectionCard type="info">
          <p className="text-sm text-textcolor-secondary">{t('cooldownBanner', { days: test.cooldownDays ?? 1 })}</p>
        </SectionCard>
      )}
      <TestResultCard
        cardType={cardType}
        cardBorder={cardBorder}
        scoreDisplay={scoreDisplay}
        scoreLabel={test.scoreLabel ?? t('scoreLabelFallback')}
        categoryTitle={test.categoryTitle ?? t('categoryTitleFallback')}
        categoryLabel={result.label || t('unknownResult')}
        summaryTitle={test.summaryTitle ?? test.title}
        summaryText={result.summaryText ?? result.label}
        alertContent={alertContent}
        ctaProgramLabel={test.ctaProgramLabel ?? t('ctaProgramFallback')}
        ctaRetryLabel={test.ctaRetryLabel ?? t('ctaRetryFallback')}
        onRetry={isCooldown ? undefined : onRetry}
      />
    </>
  )
}
