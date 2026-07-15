'use client'
import { useTranslations } from 'next-intl'

import { EnergyLevelScale } from '../NewMoodNoteSection/EnergyLevelScale'

interface EnergyAssessmentProps {
  value?: number
  onChange: (value: number) => void
  orientation?: 'horizontal' | 'vertical'
}

export function EnergyAssessment({ value, onChange, orientation }: EnergyAssessmentProps) {
  const tm = useTranslations('components.Mood')

  return (
    <div className="flex w-full flex-col justify-between max-sm:gap-2 sm:w-40">
      <h6 className="pl-4">{tm('chooseEnergy')}</h6>
      <div className="p-4">
        <EnergyLevelScale value={value} onChange={onChange} orientation={orientation} />
      </div>
    </div>
  )
}
