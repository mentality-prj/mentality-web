import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import MoodRecordsList from '@/components/MoodTracker/MoodRecordsList/MoodRecordsList'
import { NewMoodNoteSection } from '@/components/MoodTracker/NewMoodNoteSection'
import { TenDaysSummary } from '@/components/MoodTracker/TenDaysSummary'
import { PageTitle } from '@/ds/components/PageTitle'
import { getLastMoodRecords } from '@/requests/moodRecord'

export default async function MoodTracker() {
  const t = await getTranslations('pages.MoodTracker')
  const mt = await getTranslations('components.Mood')

  // server-side session for authenticated API requests
  const session = await auth()
  const res = await getLastMoodRecords(session, { limit: 10, active: true })

  const hasRecords = Boolean(res && 'data' in res && res.data && res.data.length > 0)

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="flex w-full flex-col gap-2 tablet:gap-8 desktop:flex-row">
        <div className="desktop:w-3/5">
          <NewMoodNoteSection />
        </div>
        <div className="desktop:w-2/5">
          <TenDaysSummary />
        </div>
      </div>
      {!hasRecords ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{mt('History.Title')}</h3>
              <p className="mt-1 text-sm text-gray-500">{mt('History.Empty')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{mt('History.Title')}</h3>
            </div>
          </div>

          <div className="mt-6">
            <MoodRecordsList records={res.data!} />
          </div>
        </div>
      )}
    </div>
  )
}
