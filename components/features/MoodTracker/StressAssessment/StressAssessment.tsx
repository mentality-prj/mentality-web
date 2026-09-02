'use client'
import { useTranslations } from 'next-intl'

import { StressLevelScale } from '../NewMoodNoteSection/StressLevelScale'

interface StressAssessmentProps {
  value?: number
  onChange: (value: number) => void
  orientation?: 'horizontal' | 'vertical'
}

export function StressAssessment({ value, onChange, orientation }: StressAssessmentProps) {
  const tm = useTranslations('components.Mood')

  return (
    <div className="flex w-full flex-col justify-between max-sm:gap-2 sm:w-40">
      <h6 className="pl-4">{tm('chooseStress')}</h6>
      <div className="p-4">
        <StressLevelScale value={value} onChange={onChange} orientation={orientation} />
      </div>
    </div>
  )
}
