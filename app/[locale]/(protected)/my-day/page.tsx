import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { DailyAffirmationClient } from '@/components/features/Affirmations/DailyAffirmationClient'
import { MoodStoryCard } from '@/components/features/MoodTracker/MoodStoryCard/MoodStoryCard'
import { MoodSummaryCard } from '@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCard'
import { TodayMoodNotes } from '@/components/features/MoodTracker/TodayMoodNotes/TodayMoodNotes'
import { DeadlineCountdown } from '@/components/features/MyProgress/PersonalGoals/DeadlineCountdown'
import { PersonalGoalsList } from '@/components/features/MyProgress/PersonalGoals/PersonalGoalsList'
import { DailyStatistics } from '@/components/features/Statistics/DailyStatistics/DailyStatistics'
import { YourActivity } from '@/components/features/Statistics/YourActivity/YourActivity'
import { DailyTipClient } from '@/components/features/Tips/DailyTipClient'
import { Routes } from '@/constants/routes'
import { logger } from '@/lib/logger'
import { mapMoodRecordsToCounts } from '@/mappers/mood.mappers'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { Roles } from '@/types/security'

const MyDay = async () => {
  const session = await auth()
  const t = await getTranslations('components.DailyCard')
  const isAdmin = session?.user?.role === Roles.ADMIN

  const todayRes = await getLastMoodRecords(session, { days: 1 })
  const todayRecords = 'error' in todayRes ? [] : (todayRes.data ?? [])
  const submittedToday = todayRecords.length > 0

  let moodCounts: ReturnType<typeof mapMoodRecordsToCounts> = []
  if (!submittedToday) {
    const res = await getMoodRecords(session)
    if ('error' in res) {
      logger.warn('Failed to load mood records for summary on my-day page', { error: res.error })
    } else {
      const { moodNotes } = res.data
      moodCounts = mapMoodRecordsToCounts(moodNotes ?? [])
    }
  }

  const goalsRes = await fetchPersonalGoals(session)
  const initialGoals = 'error' in goalsRes ? [] : (goalsRes.data ?? [])

  return (
    <article className="grid grid-cols-1 gap-default tablet:grid-cols-2 md:grid-cols-6 md:[grid-template-areas:'mood_mood_mood_mood_goals_goals'] xl:[grid-template-areas:'mood_mood_mood_mood_tip_tip'_'goals_goals_goals_goals_affirmation_affirmation']">
      <div className="flex flex-col gap-sm tablet:col-span-2 md:[grid-area:mood]">
        {submittedToday ? (
          <MoodStoryCard isAdmin={isAdmin} />
        ) : (
          <MoodSummaryCard title={t('greeting')} subtitle={t('greetingText')} counts={moodCounts} />
        )}
        <TodayMoodNotes />
      </div>

      <div className="md:[grid-area:goals]">
        <PersonalGoalsList
          filter="pending"
          showCreate={false}
          limit={3}
          viewAllHref={Routes.MYPROGRESSGOALS}
          readonly
          initialGoals={initialGoals}
        />
      </div>

      <div className="md:col-span-2 xl:[grid-area:affirmation]">
        <DailyAffirmationClient />
      </div>

      <div className="tablet:col-span-2 md:col-span-4 xl:[grid-area:tip]">
        <DailyTipClient />
      </div>

      <div className="tablet:col-span-2 md:col-span-3 xl:col-span-3">
        <DailyStatistics records={todayRecords} />
      </div>

      <div className="tablet:col-span-2 md:col-span-3 xl:col-span-3">
        <YourActivity records={todayRecords} />
      </div>

      <DeadlineCountdown initialGoals={initialGoals} href={Routes.MYPROGRESSGOALS} />
    </article>
  )
}

export default MyDay
