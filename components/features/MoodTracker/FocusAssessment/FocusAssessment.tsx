'use client'
import { useTranslations } from 'next-intl'

import { FocusLevelScale } from '../NewMoodNoteSection/FocusLevelScale'

interface FocusAssessmentProps {
  value?: number
  onChange: (value: number) => void
}

export function FocusAssessment({ value, onChange }: FocusAssessmentProps) {
  const tm = useTranslations('components.Mood')

  return (
    <div className="flex w-40 flex-col">
      <h6 className="pl-4">{tm('chooseFocus')}</h6>
      <div className="p-4">
        <FocusLevelScale value={value} onChange={onChange} />
      </div>
    </div>
  )
}
