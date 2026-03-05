'use client'

import { memo, useId } from 'react'

import { cn } from '@/lib/utils'

export interface QuestionOption {
  text: string
  value: number
}

interface QuestionRadioProps {
  question: string
  /** If provided — shows numbering "{index + 1}. " before the question text */
  index?: number
  options: QuestionOption[]
  selectedValue: number | null | undefined
  onChange: (value: number) => void
}

export const QuestionRadio = memo(function QuestionRadio({
  question,
  index,
  options,
  selectedValue,
  onChange,
}: QuestionRadioProps) {
  const idPrefix = useId()

  return (
    <div className="flex flex-col gap-4">
      <h4 className="leading-snug">
        {index !== undefined ? `${index + 1}. ` : ''}
        {question}
      </h4>

      <div
        role="radiogroup"
        aria-label={question}
        tabIndex={-1}
        className="flex flex-col gap-2"
        onKeyDown={(e) => {
          const dirs: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
          const delta = dirs[e.key]
          const isHome = e.key === 'Home'
          const isEnd = e.key === 'End'

          if (delta === undefined && !isHome && !isEnd) return
          e.preventDefault()

          // if nothing is selected yet, start from 0 (first option)
          const currentIdx = options.findIndex((o) => o.value === selectedValue)
          const safeIdx = currentIdx === -1 ? 0 : currentIdx
          const nextIdx = isHome ? 0 : isEnd ? options.length - 1 : (safeIdx + delta + options.length) % options.length
          const next = options[nextIdx as number]
          onChange(next.value)
          document.getElementById(`${idPrefix}-opt-${next.value}`)?.focus()
        }}
      >
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value

          return (
            <button
              id={`${idPrefix}-opt-${opt.value}`}
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (selectedValue == null && options[0]?.value === opt.value) ? 0 : -1}
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
})
