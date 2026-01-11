'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'

import { MoodNote } from './MoodNote'
import { StressAssessment } from './StressAssessment'

export const NewMoodNoteSection = () => {
  const t = useTranslations('components.Mood')

  return (
    <div className="background-alt-white flex w-full flex-col tablet:min-w-[600px]">
      <div className="px-8 pb-6 pt-8">
        <div className="text-xl font-semibold"> {t('title')} </div>
      </div>
      <div className="flex flex-col gap-default px-8">
        <MoodNote />
        <StressAssessment />
        {/* button is disabled until user enters data */}
        <Button disabled>
          <Check /> {t('save')}
        </Button>
      </div>
    </div>
  )
}
