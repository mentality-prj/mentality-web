import { getTranslations } from 'next-intl/server'

// import { auth } from '@/auth'
import DailyAffirmationClient from '@/components/Affirmations/DailyAffirmationClient'
import MoodSummaryCard from '@/components/MoodTracker/MoodSummaryCard/MoodSummaryCard'
// import DailyStatistics from '@/components/Statistics/DailyStatistics/DailyStatistics'
import DailyTipClient from '@/components/Tips/DailyTipClient'
// import { getMoodCounts } from '@/requests/summary'

const MyDay = async () => {
  // const session = await auth()
  const t = await getTranslations('components.DailyCard')
  // const res = await getMoodCounts(session)
  // const moodCounts = 'error' in res ? [] : (res ?? [])

  const moodCounts = [
    { mood: 'veryBad', count: 2 },
    { mood: 'bad', count: 5 },
    { mood: 'neutral', count: 27 },
    { mood: 'good', count: 7 },
    { mood: 'great', count: 19 },
  ]

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
