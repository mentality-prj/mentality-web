'use client'

import { memo } from 'react'

import { RadioQuestion } from '@/components/features/TestsQuestionnarie/typesTestPage'
import { cn } from '@/lib/utils'

interface Phq9QuestionProps {
  data: RadioQuestion
  index: number
  selectedValue: number | undefined
  onChange: (value: number) => void
}

function Phq9Question({ data, index, selectedValue, onChange }: Phq9QuestionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4>
        {index + 1}. {data.text}
      </h4>

      <div className="flex flex-col gap-2">
        {data.options.map((opt) => {
          const isSelected = selectedValue === opt.value

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'w-full rounded-full border px-6 py-3 text-sm font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary text-white shadow-sm'
                  : 'border-outline-secondary bg-white text-textcolor-primary hover:border-primary hover:bg-background-soft'
              )}
            >
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(Phq9Question)
