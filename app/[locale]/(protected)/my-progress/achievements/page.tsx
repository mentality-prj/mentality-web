import { CircleCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { SectionCard } from '@/ds/components/SectionCard'
import { earnedMilestones, completedGoalCount, diaryEntryCount, validActivityCount } from '@/helpers/b2cAchievements'
import { Link } from '@/i18n/navigation'
import { getServerSession } from '@/lib/get-server-session'
import { getUserDiaries } from '@/requests/diary'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { getMoodStatistics } from '@/requests/userStatistics'
import type { ActivityKind } from '@/helpers/b2cAchievements'

export default async function MyProgressAchievementsPage() {
  const t = await getTranslations('pages.MyProgress.achievements')
  const session = await getServerSession()
  const [moodResult, diaryResult, goalsResult] = await Promise.all([
    getMoodStatistics(session),
    getUserDiaries(session),
    fetchPersonalGoals(session),
  ])

  const activities: { kind: ActivityKind; count: number | null; href: string }[] = [
    {
      kind: 'mood',
      count: 'error' in moodResult ? null : validActivityCount(moodResult.data.totalRecords),
      href: `${Routes.MOODTRACKER}#mood-records-list`,
    },
    {
      kind: 'diary',
      count: 'error' in diaryResult || !Array.isArray(diaryResult.data) ? null : diaryEntryCount(diaryResult.data),
      href: Routes.DIARY,
    },
    {
      kind: 'goals',
      count: 'error' in goalsResult || !Array.isArray(goalsResult.data) ? null : completedGoalCount(goalsResult.data),
      href: Routes.MYPROGRESSGOALS,
    },
  ]

  return (
    <div className="flex flex-col gap-default">
      <section className="flex flex-col gap-xs" aria-labelledby="achievements-heading">
        <h2 id="achievements-heading" className="text-xl font-semibold">
          {t('heading')}
        </h2>
        <p className="text-sm text-textcolor-secondary">{t('description')}</p>
        <p className="text-sm text-textcolor-secondary">{t('noPressure')}</p>
      </section>

      <div className="grid grid-cols-1 gap-md tablet:grid-cols-2 desktop:grid-cols-3">
        {activities.map(({ kind, count, href }) => {
          const milestones = count === null ? [] : earnedMilestones(kind, count)

          return (
            <SectionCard key={kind} className="flex h-full flex-col">
              <div className="flex h-full flex-col gap-md">
                <div>
                  <h3 className="text-lg font-semibold">{t(`${kind}.title`)}</h3>
                  <p className="mt-1 text-sm text-textcolor-secondary">{t(`${kind}.description`)}</p>
                </div>

                {count === null ? (
                  <p role="alert" className="text-sm text-textcolor-secondary">
                    {t('loadError')}
                  </p>
                ) : (
                  <>
                    <p className="text-3xl font-semibold tabular-nums" aria-label={t('activityCount', { count })}>
                      {count}
                    </p>
                    {milestones.length > 0 ? (
                      <ul className="flex flex-col gap-sm">
                        {milestones.map((milestone) => (
                          <li key={milestone.key} className="flex items-start gap-xs text-sm">
                            <CircleCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                            <span>{t(`milestones.${milestone.key}`)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-textcolor-secondary">{t('noMilestonesYet')}</p>
                    )}
                  </>
                )}

                <Link href={href} className="mt-auto w-fit text-sm font-medium text-primary underline underline-offset-4">
                  {t(`${kind}.action`)}
                </Link>
              </div>
            </SectionCard>
          )
        })}
      </div>

      <p className="text-xs text-textcolor-secondary">{t('liveSummaryNote')}</p>
    </div>
  )
}
