'use client'
import { useTranslations } from 'next-intl'

import { FocusLevelScale } from '../NewMoodNoteSection/FocusLevelScale'

interface FocusAssessmentProps {
  value?: number
  onChange: (value: number) => void
  orientation?: 'horizontal' | 'vertical'
}

export function FocusAssessment({ value, onChange, orientation }: FocusAssessmentProps) {
  const tm = useTranslations('components.Mood')

  return (
    <div className="flex w-full flex-col justify-between max-sm:gap-2 sm:w-40">
      <h6 className="pl-4">{tm('chooseFocus')}</h6>
      <div className="p-4">
        <FocusLevelScale orientation={orientation} value={value} onChange={onChange} />
      </div>
    </div>
  )
}
