'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'

import { MoodNote } from './MoodNote'
import { StressAssessment } from './StressAssessment'

export const NewMoodNoteSection = () => {
  const t = useTranslations('components.MoodNote')

  return (
    <Card className="flex w-full flex-col bg-surface-white tablet:min-w-[600px]">
      <CardHeader className="px-8 pb-6 pt-8">
        <CardTitle className="text-xl font-semibold"> {t('title')} </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-8">
        <MoodNote />
        <StressAssessment />
        {/* button is disabled until user enters data */}
        <Button disabled>
          <Check /> {t('save')}
        </Button>
      </CardContent>
    </Card>
  )
}
