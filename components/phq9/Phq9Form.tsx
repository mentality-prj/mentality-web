'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { TestAnswers } from '@/components/features/TestsQuestionnarie/helper'
import Card from '@/components/shared/Cards/Card'
import { QuestionFormRadio } from '@/components/shared/QuestionFormRadio'
import { TestResultCard } from '@/components/shared/TestResultCard'
import { PHQ9_SEVERITY_BORDER_MAP, PHQ9_SEVERITY_CARD_MAP, PHQ9_TEST_CONFIG } from '@/config/phq9.config'
import { SectionCard } from '@/ds/components/SectionCard'
import { calculateMentalityIndex, usePhq9Form } from '@/helpers/phq9.helpers'
import { Statuses } from '@/types/status.types'

interface Phq9FormProps {
  userId: string
  isAdmin?: boolean
}

export default function Phq9Form({ userId, isAdmin = false }: Phq9FormProps) {
  const [showFormPreview, setShowFormPreview] = useState(false)
  const [step, setStep] = useState(0)
  const t = useTranslations('pages.MentalCheck')

  const {
    answers,
    isSubmitting,
    result,
    error,
    resultRef,
    isCompletedThisWeek,
    formattedLastSubmission,
    handleChange,
    submitAnswers,
    handleReset,
  } = usePhq9Form(userId)

  const total = PHQ9_TEST_CONFIG.questions.length

  const translatedQuestions = PHQ9_TEST_CONFIG.questions.map((q, i) => ({
    ...q,
    text: t(`questions.q${i}` as Parameters<typeof t>[0]),
    options: q.options.map((opt) => ({
      ...opt,
      text: t(`options.${opt.value}` as Parameters<typeof t>[0]),
    })),
  }))

  const handleLocalReset = () => {
    handleReset()
    setStep(0)
  }

  const handleStepAnswer = async (questionId: string, value: number) => {
    const updatedAnswers: TestAnswers = { ...answers, [questionId]: value }
    handleChange(questionId, value)
    const next = step + 1
    if (next < total) {
      await new Promise((r) => setTimeout(r, 250))
      setStep(next)
    } else {
      await new Promise((r) => setTimeout(r, 250))
      await submitAnswers(updatedAnswers)
    }
  }

  const currentQuestion = translatedQuestions[step as number] ?? translatedQuestions[0]

  const resultSlot = result ? (
    <TestResultCard
      cardType={PHQ9_SEVERITY_CARD_MAP[result.severity]}
      cardBorder={PHQ9_SEVERITY_BORDER_MAP[result.severity]}
      scoreDisplay={`${calculateMentalityIndex(result.score)}%`}
      scoreLabel={t('result.mentalityIndexLabel')}
      categoryTitle={t('result.severityLabel')}
      categoryLabel={t(`severity.${result.severity}` as Parameters<typeof t>[0])}
      summaryTitle={t('result.interpretationTitle')}
      summaryText={result.aiSummary ?? t(`summary.${result.severity}` as Parameters<typeof t>[0])}
      alertContent={
        result.crisisNotice ? (
          <Card type={Statuses.special} text={result.crisisNotice} className="text-sm tracking-wide" />
        ) : undefined
      }
      ctaProgramLabel={t('result.ctaProgram')}
      ctaRetryLabel={t('result.ctaRetry')}
      onRetry={handleLocalReset}
    />
  ) : null

  const statusBanner = isCompletedThisWeek ? (
    <SectionCard type="info">
      <p className="text-sm text-textcolor-secondary">
        <span className="font-medium text-textcolor-primary">{t('form.weekCompleted')}</span>{' '}
        {formattedLastSubmission && <>{t('form.lastCompleted', { date: formattedLastSubmission })}</>}
      </p>
    </SectionCard>
  ) : undefined

  return (
    <QuestionFormRadio
      config={PHQ9_TEST_CONFIG}
      questions={translatedQuestions}
      step={step}
      currentAnswer={answers[currentQuestion.id] as number | undefined}
      previewAnswers={translatedQuestions.map((q) => (answers[q.id] as number | null) ?? null)}
      onPreviewAnswerChange={(index, value) => handleChange(translatedQuestions[index as number]!.id, value)}
      isSubmitting={isSubmitting}
      error={error}
      showResult={!!result}
      resultRef={resultRef}
      resultSlot={resultSlot}
      isAdmin={isAdmin}
      showFormPreview={showFormPreview}
      onPreviewToggle={setShowFormPreview}
      onAdminReset={handleLocalReset}
      onAnswer={(value) => handleStepAnswer(currentQuestion.id, value)}
      onReset={handleLocalReset}
      onConfirmSubmit={() => submitAnswers(answers)}
      statusBanner={statusBanner}
    />
  )
}
