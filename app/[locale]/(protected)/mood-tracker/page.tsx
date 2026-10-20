import { getTranslations } from 'next-intl/server'

import { MoodRecords } from '@/components/features/MoodTracker/MoodRecords/MoodRecords'
import { NewMoodNoteSection } from '@/components/features/MoodTracker/NewMoodNoteSection/NewMoodNoteSection'
import { TenDaysSummary } from '@/components/features/MoodTracker/TenDaysSummary/TenDaysSummary'
import { WellbeingSummary } from '@/components/features/MoodTracker/WellbeingSummary/WellbeingSummary'
import { PageTitle } from '@/ds/components/PageTitle'
import { buildDailySummaries, buildMoodMarksData } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { parseMoodQuery } from '@/lib/moodQueryParser'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'

export default async function MoodTracker({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const t = await getTranslations('pages.MoodTracker')

  const session = await getServerSession()
  const timeZone = await getUserTimeZone()
  const query = parseMoodQuery(await searchParams)
  const [result, res] = await Promise.all([
    getMoodRecords(session, query),
    getLastMoodRecords(session, { days: 10, timeZone: timeZone ?? undefined }),
  ])
  // A failed remote read is not an empty history: do not claim there were no mood records.
  if ('error' in result) throw new Error('Unable to load mood records')
  if ('error' in res || !Array.isArray(res.data)) throw new Error('Unable to load mood summary')

  const { moodNotes, total } = result.data
  const history = res.data
  const moodMarksData = buildMoodMarksData(history)

  // build daily summaries: { date: 'YYYY-MM-DD', records: number }
  const summaries = buildDailySummaries(history, timeZone ?? undefined)

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="flex w-full flex-col gap-sm tablet:gap-md desktop:flex-row">
        <div className="desktop:w-3/5">
          <NewMoodNoteSection />
        </div>
        <div className="flex flex-col gap-sm desktop:w-2/5">
          <WellbeingSummary records={history} />
          {timeZone && (
            <TenDaysSummary
              moodMarksData={moodMarksData}
              lastRecordsSummary={summaries}
              records={history}
            />
          )}
        </div>
      </div>
      <MoodRecords totalCount={total} records={moodNotes} />
    </div>
  )
}
