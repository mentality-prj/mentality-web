'use client'
import { useTranslations } from 'next-intl'

import { EnergyLevelScale } from '../NewMoodNoteSection/EnergyLevelScale'

interface EnergyAssessmentProps {
  value?: number
  onChange: (value: number) => void
}

export function EnergyAssessment({ value, onChange }: EnergyAssessmentProps) {
  const tm = useTranslations('components.Mood')

  return (
    <div className="flex w-40 flex-col justify-between">
      <h6 className="pl-4">{tm('chooseEnergy')}</h6>
      <div className="p-4">
        <EnergyLevelScale value={value} onChange={onChange} />
      </div>
    </div>
  )
}
