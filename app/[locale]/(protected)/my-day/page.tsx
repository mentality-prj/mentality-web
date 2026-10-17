import { getTranslations } from 'next-intl/server'

import { DailyAffirmationClient } from '@/components/features/Affirmations/DailyAffirmationClient'
import { MoodNextStepCard } from '@/components/features/Guide/MoodNextStepCard'
import { QuickSupportCard } from '@/components/features/Guide/QuickSupportCard'
import { MoodStoryCard } from '@/components/features/MoodTracker/MoodStoryCard/MoodStoryCard'
import { MoodSummaryCard } from '@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCard'
import { TodayMoodNotes } from '@/components/features/MoodTracker/TodayMoodNotes/TodayMoodNotes'
import { DeadlineCountdown } from '@/components/features/MyProgress/PersonalGoals/DeadlineCountdown'
import { PersonalGoalsList } from '@/components/features/MyProgress/PersonalGoals/PersonalGoalsList'
import { DailyTipClient } from '@/components/features/Tips/DailyTipClient'
import { Routes } from '@/constants/routes'
import { isSubmittedToday } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { logger } from '@/lib/logger'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { mapMoodRecordsToCounts } from '@/mappers/mood.mappers'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { getTodayMoodStory } from '@/requests/moodStory'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { MoodStoryResult } from '@/types/api-responses'
import { Roles } from '@/types/security'

const MyDay = async () => {
  const session = await getServerSession()
  const t = await getTranslations('components.DailyCard')
  const isAdmin = session?.user?.role === Roles.ADMIN
  const timeZone = await getUserTimeZone()

  const todayPromise = getLastMoodRecords(session, { days: 1, timeZone: timeZone ?? undefined })
  const goalsPromise = fetchPersonalGoals(session)
  const todayRes = await todayPromise
  const todayRecords = 'error' in todayRes ? [] : (todayRes.data ?? [])
  const todayRecord = timeZone
    ? todayRecords.find(({ createdAt }) => isSubmittedToday(createdAt ?? '', timeZone))
    : undefined
  const submittedToday = todayRecord !== undefined

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

  const goalsRes = await goalsPromise
  const initialGoals = 'error' in goalsRes ? [] : (goalsRes.data ?? [])

  let storyResult: MoodStoryResult | undefined
  let recommendedAffirmationId: string | undefined
  let recommendedTipId: string | undefined
  if (submittedToday) {
    storyResult = await getTodayMoodStory(session)
    if (!('error' in storyResult)) {
      recommendedAffirmationId = storyResult.data.recommendedAffirmationId
      recommendedTipId = storyResult.data.recommendedTipId
    }
  }

  return (
    <article className="grid grid-cols-1 gap-default laptop:grid-cols-2 xl:grid-cols-4">
      <div className="flex flex-col gap-sm xl:col-span-2">
        {submittedToday ? (
          <MoodStoryCard isAdmin={isAdmin} initialStory={storyResult} />
        ) : (
          <MoodSummaryCard title={t('greeting')} subtitle={t('greetingText')} counts={moodCounts} />
        )}
        {todayRecord ? <MoodNextStepCard record={todayRecord} /> : <QuickSupportCard />}
        <DailyTipClient recommendedId={recommendedTipId} />
        <TodayMoodNotes />
      </div>

      <div className="flex flex-col gap-sm self-start xl:contents">
        {recommendedAffirmationId && (
          <div className="flex flex-col gap-sm self-start">
            <DailyAffirmationClient recommendedId={recommendedAffirmationId} />
          </div>
        )}

        <PersonalGoalsList
          filter="pending"
          showCreate={false}
          limit={3}
          viewAllHref={Routes.MYPROGRESSGOALS}
          readonly
          initialGoals={initialGoals}
          className="self-start"
        />
      </div>

      <DeadlineCountdown initialGoals={initialGoals} href={Routes.MYPROGRESSGOALS} />
    </article>
  )
}

export default MyDay
