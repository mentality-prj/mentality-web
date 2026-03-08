'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { Button } from '@/ui/button'

import { ChoiceType, TestConfig } from '../typesTestPage'

import { TestAdminBar } from './components/TestAdminBar'
import { TestCheckboxForm } from './components/TestCheckboxForm'
import { TestRadioForm } from './components/TestRadioForm'
import { TestResultScreen } from './components/TestResultScreen'
import { useTestPageForm } from './useTestPageForm'

type Props<T extends ChoiceType> = {
  test: TestConfig<T>
  userId: string
  isAdmin?: boolean
}

export function TestPageGenerator<T extends ChoiceType>({ test, userId, isAdmin = false }: Props<T>) {
  const t = useTranslations('components.TestQuestionnaire')
  const [showFormPreview, setShowFormPreview] = useState(false)
  const {
    step,
    setStep,
    answers,
    setAnswers,
    isSubmitting,
    result,
    isCooldown,
    error,
    resultRef,
    handleReset,
    submitAnswers,
  } = useTestPageForm(test, userId)

  const adminBar = isAdmin ? (
    <TestAdminBar
      testId={test.id}
      showFormPreview={showFormPreview}
      onToggle={(checked) => {
        setShowFormPreview(checked)
        if (checked) handleReset()
      }}
      onReset={() => {
        handleReset()
        setShowFormPreview(false)
      }}
    />
  ) : null

  // ─── Result screen ────────────────────────────────────────────────────────────

  if (result && !showFormPreview) {
    return (
      <div ref={resultRef} className="flex flex-col gap-4">
        <TestResultScreen
          test={test}
          result={result}
          isCooldown={isCooldown}
          adminBar={adminBar}
          onRetry={handleReset}
        />
      </div>
    )
  }

  // ─── Submitting ───────────────────────────────────────────────────────────────

  if (isSubmitting) {
    return (
      <SectionCard>
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm text-textcolor-secondary">{t('submitting')}</p>
        </div>
      </SectionCard>
    )
  }

  // ─── Error ────────────────────────────────────────────────────────────────────

  if (error) {
    const displayError =
      error === 'RATE_LIMITED'
        ? t('errorRateLimited')
        : error === 'SUBMISSION_FAILED'
          ? t('errorSubmissionFailed')
          : t('errorUnknown')

    return (
      <SectionCard type="note">
        <div className="flex flex-col gap-4">
          <p role="alert" className="text-sm text-textcolor-secondary">
            {displayError}
          </p>
          <Button variant="secondary" onClick={handleReset}>
            {t('retryFromStart')}
          </Button>
        </div>
      </SectionCard>
    )
  }

  // ─── Radio: step-by-step ──────────────────────────────────────────────────────

  if (test.type === 'radio') {
    return (
      <TestRadioForm
        test={test as TestConfig<'radio'>}
        step={step}
        answers={answers}
        adminBar={adminBar}
        onAnswer={(questionId, value) => {
          const updated = { ...answers, [questionId]: value }
          setAnswers(updated)
          const isLast = step === test.questions.length - 1
          if (!isLast) setTimeout(() => setStep((s) => s + 1), 250)
        }}
        onBack={() => setStep((s) => s - 1)}
        onSubmit={() => submitAnswers(answers)}
      />
    )
  }

  // ─── Checkbox: all at once ────────────────────────────────────────────────────

  return (
    <TestCheckboxForm
      test={test as TestConfig<'checkbox'>}
      answers={answers}
      adminBar={adminBar}
      onAnswerChange={(id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))}
      onSubmit={() => submitAnswers(answers)}
    />
  )
}
