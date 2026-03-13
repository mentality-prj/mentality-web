import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { DailyAffirmationClient } from '@/components/features/Affirmations/DailyAffirmationClient'
import { MoodSummaryCard } from '@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCard'
import { TodayMoodNotes } from '@/components/features/MoodTracker/TodayMoodNotes/TodayMoodNotes'
import { DeadlineCountdown } from '@/components/features/MyProgress/PersonalGoals/DeadlineCountdown'
import { PersonalGoalsList } from '@/components/features/MyProgress/PersonalGoals/PersonalGoalsList'
import { DailyStatistics } from '@/components/features/Statistics/DailyStatistics/DailyStatistics'
import { DailyTipClient } from '@/components/features/Tips/DailyTipClient'
import { Routes } from '@/constants/routes'
import { mapMoodRecordsToCounts } from '@/mappers/mood.mappers'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { fetchPersonalGoals } from '@/requests/personalGoals'

const MyDay = async () => {
  const session = await auth()
  const t = await getTranslations('components.DailyCard')
  const res = await getMoodRecords(session)
  const moodCounts = 'error' in res ? [] : mapMoodRecordsToCounts(res?.data ?? [])

  const todayRes = await getLastMoodRecords(session, { days: 1 })
  const todayRecords = 'error' in todayRes ? [] : (todayRes?.data ?? [])

  const goalsRes = await fetchPersonalGoals(session)
  const initialGoals = 'error' in goalsRes ? [] : (goalsRes.data ?? [])

  return (
    <article className="grid grid-cols-1 gap-default laptop:grid-cols-4">
      <div className="flex flex-col gap-sm laptop:col-span-2">
        <MoodSummaryCard title={t('greeting')} subtitle={t('greetingText')} counts={moodCounts} />
        <TodayMoodNotes />
      </div>

      <PersonalGoalsList
        filter="pending"
        showCreate={false}
        limit={3}
        viewAllHref={Routes.MYPROGRESSGOALS}
        readonly
        initialGoals={initialGoals}
        className="self-start"
      />

      <section className="flex flex-col gap-sm self-start">
        <DailyAffirmationClient />
        <DailyTipClient />
      </section>

      <div className="grid gap-default laptop:col-span-4 laptop:grid-cols-2">
        <DailyStatistics records={todayRecords} />
      </div>

      <DeadlineCountdown initialGoals={initialGoals} href={Routes.MYPROGRESSGOALS} />
    </article>
  )
}

export default MyDay
