'use client'

import { ReactNode } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { QuestionStep } from '@/components/shared/QuestionStep'
import { SectionCard } from '@/ds/components/SectionCard'
import { Button } from '@/ui/button'

import { TestAnswers } from '../../helper'
import { TestConfig } from '../../typesTestPage'

interface TestRadioFormProps {
  test: TestConfig<'radio'>
  step: number
  answers: TestAnswers
  adminBar?: ReactNode
  onAnswer: (questionId: string, value: number) => void
  onBack: () => void
  onSubmit: () => void
}

export function TestRadioForm({ test, step, answers, adminBar, onAnswer, onBack, onSubmit }: TestRadioFormProps) {
  const t = useTranslations('components.TestQuestionnaire')
  const total = test.questions.length
  const safeStep = Math.min(step, total - 1)
  const currentQuestion = test.questions.at(safeStep)!
  const isLastStep = safeStep === total - 1
  const currentAnswer = answers[currentQuestion.id] as number | undefined

  return (
    <div className="flex flex-col gap-4">
      {adminBar}
      <SectionCard>
        <div className="mb-5 flex flex-col gap-1">
          <h2>{test.title}</h2>
        </div>

        <QuestionStep
          stepLabel={t('questionOf', { current: safeStep + 1, total })}
          step={safeStep}
          total={total}
          question={currentQuestion.text}
          options={currentQuestion.options}
          selectedValue={currentAnswer}
          onChange={(value) => onAnswer(currentQuestion.id, value)}
        />

        {/* Last step action buttons: Back (to review/edit previous answers) and Submit (see results) */}
        {isLastStep && currentAnswer !== undefined && (
          <div className="mt-6 flex items-center gap-xs border-t border-border pt-5">
            {/* Back button on last step allows navigation to previous questions */}
            <Button variant="secondary" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft size={16} />
              {t('buttonBack')}
            </Button>
            {/* Submit button calculates score and displays results. onAnswer hook prevents step advancement beyond last index */}
            <Button onClick={onSubmit} className="flex items-center gap-2">
              <Send size={16} />
              {t('buttonSeeResult')}
            </Button>
          </div>
        )}
      </SectionCard>

      {/* Back button outside the card for non-final steps.
          NOTE: On the last step, this button is hidden (!isLastStep),
          but the inner back button (inside the card) is shown instead.
          Both use equivalent conditions (step === safeStep for valid values),
          but the different positioning creates redundant Back buttons on the last step.
          Consider always hiding this outer button on last step to maintain visual consistency. */}
      {step > 0 && !isLastStep && (
        <Button variant="secondary" className="flex items-center gap-2 self-start" onClick={onBack}>
          <ArrowLeft size={16} />
          {t('buttonBack')}
        </Button>
      )}
    </div>
  )
}
