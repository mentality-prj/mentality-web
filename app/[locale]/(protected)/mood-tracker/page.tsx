import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import MoodRecords from '@/components/MoodTracker/MoodRecords/MoodRecords'
import { NewMoodNoteSection } from '@/components/MoodTracker/NewMoodNoteSection/NewMoodNoteSection'
import { TenDaysSummary } from '@/components/MoodTracker/TenDaysSummary/TenDaysSummary'
import { PageTitle } from '@/ds/components/PageTitle'
import { levelToMoodKey } from '@/helpers/moodMapper'
import { getLastMoodRecords } from '@/requests/moodRecord'

export default async function MoodTracker() {
  const t = await getTranslations('pages.MoodTracker')

  const session = await auth()
  const res = await getLastMoodRecords(session, { days: 10, active: true })

  const moodMarksData = (res?.data ?? []).reduce<Record<string, number>>((acc, record) => {
    const raw = record.moodLevel
    let key: string | undefined

    if (typeof raw === 'number') {
      key = levelToMoodKey(raw)
    } else if (typeof raw === 'string') {
      // numeric string -> convert to key, otherwise assume it's already a mood key
      if (/^\d+$/.test(raw)) {
        key = levelToMoodKey(Number(raw))
      } else {
        key = raw
      }
    }

    if (key) {
      acc[key as string] = (acc[key as string] ?? 0) + 1
    }

    return acc
  }, {})

  // build daily summaries: { date: 'YYYY-MM-DD', records: number }
  const summaries = Object.entries(
    (res?.data ?? []).reduce<Record<string, number>>((acc, r) => {
      const created = r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : 'unknown'
      acc[created as string] = (acc[created as string] ?? 0) + 1
      return acc
    }, {})
  )
    .map(([date, records]) => ({ date, records }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="flex w-full flex-col gap-2 tablet:gap-8 desktop:flex-row">
        <div className="desktop:w-3/5">
          <NewMoodNoteSection />
        </div>
        <div className="desktop:w-2/5">
          <TenDaysSummary moodMarksData={moodMarksData} lastRecordsSummary={summaries} />
        </div>
      </div>
      <MoodRecords records={res.data ?? []} />
    </div>
  )
}
