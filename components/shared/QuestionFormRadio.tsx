'use client'

import { type ReactNode } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { TestConfig } from '@/components/features/TestsQuestionnarie/typesTestPage'
import { AdminPreviewToggle } from '@/components/phq9/AdminPreviewToggle'
import { QuestionStep } from '@/components/shared/QuestionStep'
import { SectionCard } from '@/ds/components/SectionCard'
import { Button } from '@/ui/button'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TranslatedQuestion {
  id: string
  text: string
  options: { text: string; value: number }[]
}

export interface QuestionFormRadioProps {
  /** TestConfig with i18nNamespace set — defines translations, question count, and test id */
  config: TestConfig<'radio'>
  /** Pre-translated questions (parent maps config.questions + useTranslations) */
  questions: TranslatedQuestion[]

  /** Current question index (0-based, always within valid question range) */
  step: number
  /** Selected answer for the active question */
  currentAnswer: number | null | undefined

  isSubmitting: boolean
  error: string | null

  /** When true, renders the result slot instead of the question step */
  showResult: boolean
  resultRef?: React.RefObject<HTMLDivElement | null>

  /** Test-specific result card (e.g. Phq9Result or Gad7Result) */
  resultSlot: ReactNode

  // ── Admin bar ────────────────────────────────────────────────────────────────
  isAdmin?: boolean
  showFormPreview: boolean
  onPreviewToggle: (checked: boolean) => void
  onAdminReset: () => void

  // ── Callbacks ────────────────────────────────────────────────────────────────
  onAnswer: (value: number) => void
  /** Called by the error-screen reset button */
  onReset: () => void

  // ── Optional slots ────────────────────────────────────────────────────────────
  /** Extra banner above the question card (e.g. PHQ-9 "completed this week" info) */
  statusBanner?: ReactNode

  // ── Submit step (GAD-7 style) ─────────────────────────────────────────────────
  /** Shows a submit footer (back + confirm) on the last question */
  isSubmitStep?: boolean
  /** Shows a Back button below the question card (step mode only) */
  canGoBack?: boolean
  onGoBack?: () => void
  onConfirmSubmit?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

// Cast to a known namespace so TS can verify key names.
// Both MentalCheck and AnxietyCheck share the same key structure used here.
type KnownNs = 'pages.AnxietyCheck' | 'pages.MentalCheck'

export function QuestionFormRadio({
  config,
  questions,
  step,
  currentAnswer,
  isSubmitting,
  error,
  showResult,
  resultRef,
  resultSlot,
  isAdmin = false,
  showFormPreview,
  onPreviewToggle,
  onAdminReset,
  onAnswer,
  onReset,
  statusBanner,
  isSubmitStep = false,
  canGoBack = false,
  onGoBack,
  onConfirmSubmit,
}: QuestionFormRadioProps) {
  const t = useTranslations((config.i18nNamespace ?? 'pages.AnxietyCheck') as KnownNs)

  const total = questions.length
  const currentQuestion = questions[step as number] ?? questions[0]

  const displayError =
    error === 'RATE_LIMITED'
      ? t('form.rateLimitError')
      : error === 'SUBMISSION_FAILED'
        ? t('form.submissionError')
        : error === 'UNEXPECTED_ERROR'
          ? t('form.unexpectedError')
          : error

  const adminBar = isAdmin && (
    <div className="flex items-center gap-3">
      <AdminPreviewToggle
        id={`${config.id}-admin-form-preview`}
        checked={showFormPreview}
        onCheckedChange={onPreviewToggle}
        label={t('form.adminPreviewLabel')}
      />
      <Button variant="secondary" size="small" onClick={onAdminReset}>
        {t('form.adminClearData')}
      </Button>
    </div>
  )

  // ─── Result screen ────────────────────────────────────────────────────────────

  if (showResult && !showFormPreview) {
    return (
      <div ref={resultRef} className="flex flex-col gap-4">
        {adminBar}
        {resultSlot}
      </div>
    )
  }

  // ─── Submitting ───────────────────────────────────────────────────────────────

  if (isSubmitting) {
    return (
      <SectionCard>
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm text-textcolor-secondary">{t('form.submitting')}</p>
        </div>
      </SectionCard>
    )
  }

  // ─── Error fallback ───────────────────────────────────────────────────────────

  if (error) {
    return (
      <SectionCard type="note">
        <div className="flex flex-col gap-4">
          <p role="alert" className="text-sm text-textcolor-secondary">
            {displayError}
          </p>
          <Button variant="secondary" onClick={onReset}>
            {t('form.startNew')}
          </Button>
        </div>
      </SectionCard>
    )
  }

  // ─── Question step ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {adminBar}
      {statusBanner}

      <SectionCard>
        <div className="mb-5 flex flex-col gap-1">
          <h2>{t('intro.title')}</h2>
          <p className="text-sm text-textcolor-secondary">{t('intro.subtitle')}</p>
        </div>

        <QuestionStep
          stepLabel={t('form.questionCount', { current: step + 1, total })}
          step={step}
          total={total}
          question={currentQuestion.text}
          options={currentQuestion.options}
          selectedValue={currentAnswer}
          onChange={onAnswer}
        />

        {isSubmitStep && (
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
            <p className="text-sm text-textcolor-secondary">{t('form.readyToSubmit')}</p>
            <div className="flex items-center gap-3">
              <Button variant="secondary" type="button" onClick={onGoBack} className="flex items-center gap-2">
                <ArrowLeft size={16} />
                {t('form.back')}
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={onConfirmSubmit}
                className="flex items-center gap-2"
              >
                <Send size={16} />
                {t('form.submit')}
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      {canGoBack && (
        <Button variant="secondary" className="flex items-center gap-2 self-start" onClick={onGoBack}>
          <ArrowLeft size={16} />
          {t('form.back')}
        </Button>
      )}
    </div>
  )
}
