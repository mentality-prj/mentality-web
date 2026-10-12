import { MoodMarksData } from '@/constants/moods'
import { SectionCard } from '@/ds/components/SectionCard'
import { MoodRecordEntity } from '@/types/api-responses'
import { DaySummary } from '@/types/daySummary'

import { BestDay } from './BestDay'
import { LastTenDaysMoodRecords } from './LastTenDaysMoodRecords'
import { MoodMarks } from './MoodMarks'
import { StressLevel } from './StressLevel'

export async function TenDaysSummary({
  moodMarksData,
  lastRecordsSummary,
  records,
}: {
  moodMarksData?: MoodMarksData
  lastRecordsSummary?: DaySummary[]
  records?: MoodRecordEntity[]
}) {
  return (
    <SectionCard className="p-4 md:p-6">
      <div className="flex flex-col items-center justify-center gap-sm">
        <BestDay summaries={lastRecordsSummary} records={records} />
        <LastTenDaysMoodRecords summaries={lastRecordsSummary} />
        <MoodMarks data={moodMarksData} />
        <StressLevel summaries={lastRecordsSummary} />
      </div>
    </SectionCard>
  )
}
