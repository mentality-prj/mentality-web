'use client'

import { ReactNode } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Label } from '@/ui/label'

import { TestAnswers } from '../../helper'
import { TestConfig } from '../../typesTestPage'

interface TestCheckboxFormProps {
  test: TestConfig<'checkbox'>
  answers: TestAnswers
  adminBar?: ReactNode
  onAnswerChange: (questionId: string, value: boolean) => void
  onSubmit: () => void
}

export function TestCheckboxForm({ test, answers, adminBar, onAnswerChange, onSubmit }: TestCheckboxFormProps) {
  const t = useTranslations('components.TestQuestionnaire')
  const hasAnyChecked = Object.values(answers).some((v) => v === true)

  return (
    <div className="flex flex-col gap-4">
      {adminBar}
      <SectionCard>
        <h2 className="mb-5">{test.title}</h2>

        <div className="flex flex-col gap-3">
          {test.questions.map((q) => (
            <div key={q.id} className="flex items-start gap-3">
              <Checkbox
                id={`cb-${q.id}`}
                checked={!!answers[q.id]}
                onCheckedChange={(checked) => onAnswerChange(q.id, !!checked)}
                className="mt-0.5"
              />
              <Label className="text-sm tablet:text-base" htmlFor={`cb-${q.id}`}>
                {q.text}
              </Label>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <Button disabled={!hasAnyChecked} onClick={onSubmit} className="flex items-center gap-2">
            <Send size={16} />
            {t('buttonSeeResult')}
          </Button>
        </div>
      </SectionCard>
    </div>
  )
}
