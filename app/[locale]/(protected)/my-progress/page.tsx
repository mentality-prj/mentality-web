import { getTranslations } from 'next-intl/server'

import { MoodProgressSummary } from '@/components/features/MoodTracker/MoodProgressSummary/MoodProgressSummary'
import { HelpfulExercisesSummary } from '@/components/features/MyProgress/HelpfulExercisesSummary'
import { PersonalGoalsList } from '@/components/features/MyProgress/PersonalGoals/PersonalGoalsList'
import { Routes } from '@/constants/routes'
import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'
import { getServerSession } from '@/lib/get-server-session'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { getExerciseFeedback } from '@/requests/exerciseFeedback'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { getMoodStatistics } from '@/requests/userStatistics'

export default async function MyProgress() {
  const session = await getServerSession()
  const t = await getTranslations('pages.MyProgress.overview')
  const timeZone = await getUserTimeZone()
  const [moodResult, goalsResult, feedbackResult] = await Promise.all([
    getMoodStatistics(session, timeZone),
    fetchPersonalGoals(session),
    getExerciseFeedback(session),
  ])

  return (
    <div className="flex flex-col gap-default">
      <section className="flex flex-col gap-sm" aria-labelledby="progress-history-heading">
        <div>
          <h2 id="progress-history-heading" className="text-lg font-semibold">
            {t('historyHeading')}
          </h2>
          <p className="text-sm text-textcolor-secondary">{t('historyDescription')}</p>
        </div>
        <div className="grid grid-cols-1 gap-md tablet:grid-cols-2">
          <SectionCard>
            <div className="flex flex-col gap-sm">
              <h3 className="font-semibold">{t('moodTitle')}</h3>
              <p className="text-sm text-textcolor-secondary">{t('moodDescription')}</p>
              <Link
                href={`${Routes.MOODTRACKER}#mood-records-list`}
                className="w-fit text-sm font-medium text-primary underline underline-offset-4"
              >
                {t('moodLink')}
              </Link>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="flex flex-col gap-sm">
              <h3 className="font-semibold">{t('diaryTitle')}</h3>
              <p className="text-sm text-textcolor-secondary">{t('diaryDescription')}</p>
              <Link href={Routes.DIARY} className="w-fit text-sm text-primary underline underline-offset-4">
                {t('diaryLink')}
              </Link>
            </div>
          </SectionCard>
        </div>
      </section>

      <MoodProgressSummary
        stats={'error' in moodResult ? null : moodResult.data}
        failed={'error' in moodResult}
        timeZone={timeZone}
      />

      <HelpfulExercisesSummary
        feedback={'error' in feedbackResult ? [] : feedbackResult.data}
        failed={'error' in feedbackResult}
      />

      <section className="flex flex-col gap-sm" aria-labelledby="progress-goals-heading">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <h2 id="progress-goals-heading" className="text-lg font-semibold">
            {t('goalsHeading')}
          </h2>
          <Link href={Routes.MYPROGRESSGOALS} className="text-sm text-primary underline underline-offset-4">
            {t('goalsLink')}
          </Link>
        </div>
        {'error' in goalsResult ? (
          <p role="alert" className="text-sm text-textcolor-secondary">
            {t('goalsError')}
          </p>
        ) : (
          <PersonalGoalsList
            filter="pending"
            showCreate={false}
            limit={3}
            viewAllHref={Routes.MYPROGRESSGOALS}
            initialGoals={goalsResult.data ?? []}
          />
        )}
      </section>
    </div>
  )
}
