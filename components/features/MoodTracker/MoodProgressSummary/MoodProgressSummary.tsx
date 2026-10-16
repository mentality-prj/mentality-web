import { getTranslations } from 'next-intl/server'

import { SectionCard } from '@/ds/components/SectionCard'
import { calculateMoodProgress } from '@/helpers/moodProgress'
import type { MoodStatistics } from '@/types/userStatistics'

import { MoodProgressTrend } from './MoodProgressTrend'

type Props = {
  stats: MoodStatistics | null
  failed?: boolean
}

export async function MoodProgressSummary({ stats, failed = false }: Props) {
  const t = await getTranslations('pages.MoodTracker.progress')
  const summary = stats ? calculateMoodProgress(stats) : null

  const changeText = (change: number | null, lowerIsBetter: boolean): string => {
    if (change === null) return t('notEnough')
    if (change === 0) return t('noChange')
    const direction = change < 0 === lowerIsBetter ? 'improved' : 'increased'
    return t(direction, { amount: Math.abs(change) })
  }

  const emptyMessage = t(failed ? 'loadError' : 'empty')
  const stressDescription = summary ? `${t('stressChange')}: ${changeText(summary.stressChange, true)}` : ''
  const moodDescription = summary ? `${t('moodChange')}: ${changeText(summary.moodChange, false)}` : ''

  return (
    <section className="grid grid-cols-1 gap-md desktop:grid-cols-2" aria-label={t('heading')}>
      <SectionCard className="p-4 md:p-6">
        <div className="flex flex-col gap-sm">
          <div>
            <h2 className="text-lg font-semibold">{t('stressTitle')}</h2>
            <p className="text-sm text-textcolor-secondary">{t('stressSubtitle')}</p>
          </div>
          {summary?.stressScore !== null && summary?.stressScore !== undefined ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold tabular-nums">{summary.stressScore}</span>
                <span className="text-base text-textcolor-secondary">/ 100</span>
              </div>
              <div
                role="meter"
                aria-label={t('stressTitle')}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={summary.stressScore}
                className="h-2 w-full overflow-hidden rounded-full bg-black/10"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${summary.stressScore}%` }}
                />
              </div>
              <p className="text-xs text-textcolor-secondary">{t('observedDays', { count: summary.recentDays })}</p>
              <p className="text-sm text-textcolor-secondary">{stressDescription}</p>
            </>
          ) : (
            <p className="rounded-lg bg-black/5 p-4 text-sm text-textcolor-secondary">{emptyMessage}</p>
          )}
          <p className="text-xs text-textcolor-secondary">{t('disclaimer')}</p>
        </div>
      </SectionCard>

      <SectionCard className="p-4 md:p-6">
        <div className="flex flex-col gap-sm">
          <div>
            <h2 className="text-lg font-semibold">{t('heading')}</h2>
            <p className="text-sm text-textcolor-secondary">{t('subtitle')}</p>
          </div>
          {summary && summary.recentDays > 0 ? (
            <>
              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-black/5 p-3">
                  <dt className="text-xs text-textcolor-secondary">{t('currentStreak')}</dt>
                  <dd className="text-2xl font-semibold tabular-nums">{summary.currentStreak}</dd>
                </div>
                <div className="rounded-lg bg-black/5 p-3">
                  <dt className="text-xs text-textcolor-secondary">{t('longestStreak')}</dt>
                  <dd className="text-2xl font-semibold tabular-nums">{summary.longestStreak}</dd>
                </div>
              </dl>
              <p className="text-sm text-textcolor-secondary">{moodDescription}</p>
              <MoodProgressTrend
                trend={summary.trend}
                moodLabel={t('mood')}
                stressLabel={t('stress')}
                chartAccessible={t('chartAccessible')}
              />
            </>
          ) : (
            <p className="rounded-lg bg-black/5 p-4 text-sm text-textcolor-secondary">{emptyMessage}</p>
          )}
          <p className="text-xs text-textcolor-secondary">{t('dateNote')}</p>
        </div>
      </SectionCard>
    </section>
  )
}
