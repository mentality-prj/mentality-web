'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { RadioQuestion } from '@/components/features/TestsQuestionnarie/typesTestPage'
import { PHQ9_TEST_CONFIG } from '@/constants/phq9'
import { SectionCard } from '@/ds/components/SectionCard'
import { usePhq9Form } from '@/helpers/phq9.helpers'
import { Button } from '@/ui/button'

import { AdminPreviewToggle } from './AdminPreviewToggle'
import Phq9Question from './Phq9Question'
import Phq9Result from './Phq9Result'

interface Phq9FormProps {
  userId: string
  isAdmin?: boolean
}

export default function Phq9Form({ userId, isAdmin = false }: Phq9FormProps) {
  const [showFormPreview, setShowFormPreview] = useState(false)
  const t = useTranslations('pages.MentalCheck')

  const {
    answers,
    isSubmitting,
    result,
    error,
    lastSubmittedAt,
    resultRef,
    canSubmit,
    isCompletedThisWeek,
    formattedLastSubmission,
    handleChange,
    handleSubmit,
    handleReset,
  } = usePhq9Form(userId)

  const translatedQuestions = PHQ9_TEST_CONFIG.questions.map((q, i) => ({
    ...q,
    text: t(`questions.q${i}` as Parameters<typeof t>[0]),
    options: q.options.map((opt) => ({
      ...opt,
      text: t(`options.${opt.value}` as Parameters<typeof t>[0]),
    })),
  }))

  const displayError = error === '429' ? t('form.rateLimitError') : error

  return (
    <div className="flex flex-col gap-6">
      {isCompletedThisWeek && (
        <SectionCard type="info">
          <p className="text-sm text-textcolor-secondary">
            <span className="font-medium text-textcolor-primary">{t('form.weekCompleted')}</span>{' '}
            {formattedLastSubmission && <>{t('form.lastCompleted', { date: formattedLastSubmission })}</>}
          </p>
        </SectionCard>
      )}

      {result ? (
        <div ref={resultRef} className="flex flex-col gap-4">
          {isAdmin && (
            <div className="flex items-center gap-3">
              <AdminPreviewToggle
                id="admin-form-preview"
                checked={showFormPreview}
                onCheckedChange={setShowFormPreview}
                label={t('form.adminPreviewLabel')}
              />
              <Button variant="secondary" size="small" onClick={handleReset}>
                {t('form.adminClearData')}
              </Button>
            </div>
          )}

          {showFormPreview ? (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {translatedQuestions.map((question, index) => (
                <SectionCard key={question.id}>
                  <Phq9Question
                    data={question as RadioQuestion}
                    index={index}
                    selectedValue={answers[question.id] as number | undefined}
                    onChange={(value) => handleChange(question.id, value)}
                  />
                </SectionCard>
              ))}

              {displayError && (
                <SectionCard type="note">
                  <p role="alert" className="text-sm text-textcolor-secondary">
                    {displayError}
                  </p>
                </SectionCard>
              )}

              <Button type="submit" disabled={!canSubmit} className="self-start">
                {isSubmitting ? t('form.submitting') : t('form.submit')}
              </Button>
            </form>
          ) : (
            <Phq9Result result={result} />
          )}

          {lastSubmittedAt && !isCompletedThisWeek && !showFormPreview && (
            <Button variant="secondary" onClick={handleReset}>
              {t('form.startNew')}
            </Button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {translatedQuestions.map((question, index) => (
            <SectionCard key={question.id}>
              <Phq9Question
                data={question as RadioQuestion}
                index={index}
                selectedValue={answers[question.id] as number | undefined}
                onChange={(value) => handleChange(question.id, value)}
              />
            </SectionCard>
          ))}

          {displayError && (
            <SectionCard type="note">
              <p role="alert" className="text-sm text-textcolor-secondary">
                {displayError}
              </p>
            </SectionCard>
          )}

          {lastSubmittedAt && <p className="text-sm text-textcolor-secondary">{t('form.resubmitCooldown')}</p>}

          <Button type="submit" disabled={!canSubmit} className="self-start">
            {isSubmitting ? t('form.submitting') : t('form.submit')}
          </Button>
        </form>
      )}
    </div>
  )
}
