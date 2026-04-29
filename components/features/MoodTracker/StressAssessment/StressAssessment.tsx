'use client'
import { useTranslations } from 'next-intl'

import { StressLevelScale } from '../NewMoodNoteSection/StressLevelScale'

interface StressAssessmentProps {
  value?: number
  onChange: (value: number) => void
}

export function StressAssessment({ value, onChange }: StressAssessmentProps) {
  const tm = useTranslations('components.Mood')

  return (
    <div className="flex w-40 flex-col justify-between">
      <h6 className="pl-4">{tm('chooseStress')}</h6>
      <div className="p-4">
        <StressLevelScale value={value} onChange={onChange} />
      </div>
    </div>
  )
}
