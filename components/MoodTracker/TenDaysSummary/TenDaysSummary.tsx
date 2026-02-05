import { getTranslations } from 'next-intl/server'

import { MoodMarksData } from '@/constants/moods'
import { SectionCard } from '@/ds/components/SectionCard'
import { DaySummary } from '@/types/daySummary'

import { BestDay } from './BestDay'
import { LastTenDaysMoodRecords } from './LastTenDaysMoodRecords'
import { MoodMarks } from './MoodMarks'
import { StressLevel } from './StressLevel'

export async function TenDaysSummary({
  moodMarksData,
  lastRecordsSummary,
}: {
  moodMarksData?: MoodMarksData
  lastRecordsSummary?: DaySummary[]
}) {
  const t = await getTranslations('components.TenDaysSummary')
  return (
    <SectionCard className="max-w-fit">
      <h2>{t('title')}</h2>
      <div className="mt-6 flex flex-col items-center justify-center gap-default">
        <BestDay />
        <LastTenDaysMoodRecords summaries={lastRecordsSummary} />
        <StressLevel summaries={lastRecordsSummary} />
        <MoodMarks data={moodMarksData} />
      </div>
    </SectionCard>
  )
}
