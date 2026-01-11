import { getTranslations } from 'next-intl/server'

import DailyAffirmationClient from '@/components/Affirmations/DailyAffirmationClient'
import MoodSummaryCard from '@/components/MoodTracker/MoodSummaryCard/MoodSummaryCard'
// import DailyStatistics from '@/components/Statistics/DailyStatistics/DailyStatistics'
import DailyTipClient from '@/components/Tips/DailyTipClient'
import { mockMoodCounts } from '@/REST/mockApi'

const MyDay = async () => {
  const t = await getTranslations('components.DailyCard')
  const moodCounts = await mockMoodCounts()

  return (
    <article className="grid gap-4 laptop:grid-cols-2">
      <MoodSummaryCard title={t('greeting')} subtitle={t('greetingText')} counts={moodCounts} />

      <section className="grid grid-cols-2 gap-4">
        <DailyAffirmationClient />
        <DailyTipClient />
      </section>

      {/* <DailyStatistics /> */}
    </article>
  )
}

export default MyDay
