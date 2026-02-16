import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { MoodRecords } from '@/components/MoodTracker/MoodRecords/MoodRecords'
import { NewMoodNoteSection } from '@/components/MoodTracker/NewMoodNoteSection/NewMoodNoteSection'
import { TenDaysSummary } from '@/components/MoodTracker/TenDaysSummary/TenDaysSummary'
import { PageTitle } from '@/ds/components/PageTitle'
import { buildDailySummaries, buildMoodMarksData } from '@/helpers/mood.helpers'
import { getLastMoodRecords } from '@/requests/moodRecord'

export default async function MoodTracker() {
  const t = await getTranslations('pages.MoodTracker')

  const session = await auth()
  const res = await getLastMoodRecords(session, { days: 10, active: true })

  const moodMarksData = buildMoodMarksData(res?.data ?? [])

  // build daily summaries: { date: 'YYYY-MM-DD', records: number }
  const summaries = buildDailySummaries(res?.data ?? [])

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="flex w-full flex-col gap-xs tablet:gap-md desktop:flex-row">
        <div className="desktop:w-3/5">
          <NewMoodNoteSection />
        </div>
        <div className="desktop:w-2/5">
          <TenDaysSummary moodMarksData={moodMarksData} lastRecordsSummary={summaries} records={res.data ?? []} />
        </div>
      </div>
      <MoodRecords records={res.data ?? []} />
    </div>
  )
}
