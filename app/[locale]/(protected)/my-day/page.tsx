import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { DailyAffirmationClient } from '@/components/features/Affirmations/DailyAffirmationClient'
import { MoodSummaryCard } from '@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCard'
import { DailyStatistics } from '@/components/features/Statistics/DailyStatistics/DailyStatistics'
import { DailyTipClient } from '@/components/features/Tips/DailyTipClient'
import { mapMoodRecordsToCounts } from '@/mappers/mood.mappers'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'

const MyDay = async () => {
  const session = await auth()
  const t = await getTranslations('components.DailyCard')
  const res = await getMoodRecords(session)
  const moodCounts = 'error' in res ? [] : mapMoodRecordsToCounts(res?.data ?? [])

  const todayRes = await getLastMoodRecords(session, { days: 1, active: true })
  const todayRecords = 'error' in todayRes ? [] : (todayRes?.data ?? [])

  return (
    <article className="grid gap-default laptop:grid-cols-2">
      <MoodSummaryCard title={t('greeting')} subtitle={t('greetingText')} counts={moodCounts} />

      <section className="grid grid-cols-2 gap-sm">
        <DailyAffirmationClient />
        <DailyTipClient />
      </section>

      <DailyStatistics records={todayRecords} />
    </article>
  )
}

export default MyDay
