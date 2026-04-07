'use client'

import { QuestionOption, QuestionRadio } from './QuestionRadio'

interface QuestionStepProps {
  stepLabel: string
  step: number
  total: number
  question: string
  options: QuestionOption[]
  selectedValue: number | null | undefined
  onChange: (value: number) => void
}

export function QuestionStep({
  stepLabel,
  step,
  total,
  question,
  options,
  selectedValue,
  onChange,
}: QuestionStepProps) {
  const progress = ((step + 1) / total) * 100

  return (
    <div className="flex flex-col gap-sm">
      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-textcolor-secondary">{stepLabel}</span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-soft">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={total}
          />
        </div>
      </div>

      <QuestionRadio question={question} options={options} selectedValue={selectedValue} onChange={onChange} />
    </div>
  )
}
