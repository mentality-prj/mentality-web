import { getTranslations } from 'next-intl/server'

import { MoodNextStepCard } from '@/components/features/Guide/MoodNextStepCard'
import { QuickSupportCard } from '@/components/features/Guide/QuickSupportCard'
import { MoodProgressSummary } from '@/components/features/MoodTracker/MoodProgressSummary/MoodProgressSummary'
import { MoodRecords } from '@/components/features/MoodTracker/MoodRecords/MoodRecords'
import { NewMoodNoteSection } from '@/components/features/MoodTracker/NewMoodNoteSection/NewMoodNoteSection'
import { TenDaysSummary } from '@/components/features/MoodTracker/TenDaysSummary/TenDaysSummary'
import { WellbeingSummary } from '@/components/features/MoodTracker/WellbeingSummary/WellbeingSummary'
import { PageTitle } from '@/ds/components/PageTitle'
import { buildDailySummaries, buildMoodMarksData, isSubmittedToday } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { parseMoodQuery } from '@/lib/moodQueryParser'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { getMoodStatistics } from '@/requests/userStatistics'

export default async function MoodTracker({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const t = await getTranslations('pages.MoodTracker')

  const session = await getServerSession()
  const query = parseMoodQuery(await searchParams)
  const [result, res, progressResult] = await Promise.all([
    getMoodRecords(session, query),
    getLastMoodRecords(session, { days: 10 }),
    getMoodStatistics(session),
  ])
  // Invalid remote data and backend errors are not empty mood histories.
  // Let the existing protected error boundary render the failure.
  if ('error' in result) throw new Error('Unable to load mood records')
  if ('error' in res) throw new Error('Unable to load mood summary')

  const { moodNotes, total } = result.data
  const moodMarksData = buildMoodMarksData(res.data)

  // build daily summaries: { date: 'YYYY-MM-DD', records: number }
  const summaries = buildDailySummaries(res.data)
  const todayRecord =
    res.data.find((record) => typeof record.createdAt === 'string' && isSubmittedToday(record.createdAt)) ?? null

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="flex w-full flex-col gap-sm tablet:gap-md desktop:flex-row">
        <div className="flex flex-col gap-sm desktop:w-3/5">
          <NewMoodNoteSection />
          {todayRecord ? <MoodNextStepCard record={todayRecord} /> : <QuickSupportCard />}
        </div>
        <div className="flex flex-col gap-sm desktop:w-2/5">
          <WellbeingSummary records={res.data} />
          <TenDaysSummary moodMarksData={moodMarksData} lastRecordsSummary={summaries} records={res.data} />
        </div>
      </div>
      <MoodProgressSummary
        stats={'error' in progressResult ? null : progressResult.data}
        failed={'error' in progressResult}
      />
      <MoodRecords totalCount={total} records={moodNotes} />
    </div>
  )
}
