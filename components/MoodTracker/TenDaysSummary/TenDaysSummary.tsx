import { getTranslations } from 'next-intl/server'

import { SectionCard } from '@/ds/components/SectionCard'

import { MoodMarksData } from '../moods'

import { BestDay } from './BestDay'
import { MoodMarks } from './MoodMarks'
import { MoodRecording } from './MoodRecording'
import { StressLevel } from './StressLevel'

export const TenDaysSummary = async ({ moodMarksData }: { moodMarksData?: MoodMarksData }) => {
  const t = await getTranslations('components.TenDaysSummary')
  return (
    <SectionCard className="max-w-fit">
      <h2>{t('title')}</h2>
      <div className="mt-6 flex flex-col items-center justify-center gap-default">
        <BestDay />
        <MoodMarks data={moodMarksData} />
        <StressLevel />
        <MoodRecording />
      </div>
    </SectionCard>
  )
}
