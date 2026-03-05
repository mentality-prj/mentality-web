'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { QuestionFormRadio } from '@/components/shared/QuestionFormRadio'
import { TestResultCard } from '@/components/shared/TestResultCard'
import { GAD7_LEVEL_BORDER_MAP, GAD7_LEVEL_CARD_MAP, GAD7_TEST_CONFIG } from '@/config/gad7.config'
import { SectionCard } from '@/ds/components/SectionCard'
import { isHighAnxiety, useGad7Form } from '@/helpers/gad7.helpers'
import { Gad7AnswerValue } from '@/types/gad7'

interface Gad7FormProps {
  userId: string
  isAdmin?: boolean
}

export default function Gad7Form({ userId, isAdmin = false }: Gad7FormProps) {
  const [showFormPreview, setShowFormPreview] = useState(false)
  const t = useTranslations('pages.AnxietyCheck')

  const {
    step,
    answers,
    isSubmitting,
    result,
    error,
    resultRef,
    handleAnswer,
    setAnswerAt,
    submitAllAnswers,
    goBack,
    handleReset,
  } = useGad7Form(userId)

  const total = GAD7_TEST_CONFIG.questions.length

  const translatedQuestions = GAD7_TEST_CONFIG.questions.map((q, i) => ({
    ...q,
    text: t(`questions.q${i}` as Parameters<typeof t>[0]),
    options: q.options.map((opt) => ({
      ...opt,
      text: t(`options.${opt.value}` as Parameters<typeof t>[0]),
    })),
  }))

  const isSubmitStep = (step as number) >= total
  const questionIndex = isSubmitStep ? total - 1 : (step as number)

  const resultSlot = result ? (
    <TestResultCard
      cardType={GAD7_LEVEL_CARD_MAP[result.level]}
      cardBorder={GAD7_LEVEL_BORDER_MAP[result.level]}
      scoreDisplay={String(result.score)}
      scoreLabel={t('result.scoreLabel')}
      categoryTitle={t('result.levelLabel')}
      categoryLabel={t(`level.${result.level}` as Parameters<typeof t>[0])}
      summaryTitle={t('result.recommendationTitle')}
      summaryText={result.recommendation || t(`summary.${result.level}` as Parameters<typeof t>[0])}
      alertContent={
        isHighAnxiety(result.score) ? (
          <SectionCard type="note">
            <p className="text-sm leading-relaxed text-textcolor-secondary">{t('result.supportiveMessage')}</p>
          </SectionCard>
        ) : undefined
      }
      ctaProgramLabel={t('result.ctaProgram')}
      ctaRetryLabel={t('result.ctaRetry')}
      onRetry={handleReset}
    />
  ) : null

  return (
    <QuestionFormRadio
      config={GAD7_TEST_CONFIG}
      questions={translatedQuestions}
      step={questionIndex}
      currentAnswer={answers[questionIndex as number]}
      previewAnswers={answers}
      onPreviewAnswerChange={(index, value) => setAnswerAt(index, value as Gad7AnswerValue)}
      isSubmitting={isSubmitting}
      error={error}
      showResult={(step as number) >= total && !!result}
      resultRef={resultRef}
      resultSlot={resultSlot}
      isAdmin={isAdmin}
      showFormPreview={showFormPreview}
      onPreviewToggle={setShowFormPreview}
      onAdminReset={() => {
        handleReset()
        setShowFormPreview(false)
      }}
      onAnswer={(value) =>
        isSubmitStep ? setAnswerAt(questionIndex, value as Gad7AnswerValue) : handleAnswer(value as Gad7AnswerValue)
      }
      onReset={handleReset}
      isSubmitStep={isSubmitStep}
      canGoBack={!isSubmitStep && (step as number) > 0}
      onGoBack={goBack}
      onConfirmSubmit={() => submitAllAnswers(answers)}
    />
  )
}
