'use client'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { StressLevelScale } from '../NewMoodNoteSection/StressLevelScale'

interface StressAssessmentProps {
  onChange: (value: number) => void
}

export function StressAssessment({ onChange }: StressAssessmentProps) {
  const tm = useTranslations('components.Mood')

  return (
    <div className="flex w-40 flex-col">
      <h5>{tm('chooseStress')}</h5>
      <div className="p-4">
        <StressLevelScale onChange={onChange} />
      </div>
      <p className="text-xs">
        {tm('quickAssessmentPrefix')}
        <Link href="#" className="defalt-link text-xs">
          {tm('quickAssessmentLink')}
        </Link>
        {tm('quickAssessmentSuffix')}
      </p>
    </div>
  )
}
