import { getTranslations } from 'next-intl/server'

import { SectionCard } from '@/ds/components/SectionCard'
import { calculateWellbeingSummary, type WellbeingDimension } from '@/helpers/wellbeing'
import type { MoodRecordEntity } from '@/types/api-responses'

type Props = {
  records: MoodRecordEntity[]
}

const dimensions: WellbeingDimension[] = ['mood', 'stressBalance', 'energy', 'focus']

export async function WellbeingSummary({ records }: Props) {
  const t = await getTranslations('pages.MoodTracker.wellbeing')
  const summary = calculateWellbeingSummary(records)

  return (
    <SectionCard className="p-4 md:p-6">
      <div className="flex flex-col gap-sm">
        <div>
          <h2 className="text-lg font-semibold">{t('title')}</h2>
          <p className="text-sm text-textcolor-secondary">{t('subtitle')}</p>
        </div>

        {summary ? (
          <>
            <div className="flex items-baseline gap-2" aria-label={t('scoreAccessible', { score: summary.score })}>
              <span className="text-4xl font-semibold tabular-nums">{summary.score}</span>
              <span className="text-base text-textcolor-secondary">/ 100</span>
            </div>
            <div
              role="meter"
              aria-label={t('title')}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={summary.score}
              className="h-2 w-full overflow-hidden rounded-full bg-black/10"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${summary.score}%` }}
              />
            </div>
            <p className="text-xs text-textcolor-secondary">{t('entries', { count: summary.recordCount })}</p>
            <dl className="grid grid-cols-2 gap-3 pt-2">
              {dimensions.map((dimension) => (
                <div key={dimension} className="rounded-lg bg-black/5 p-3">
                  <dt className="text-xs text-textcolor-secondary">{t(`dimensions.${dimension}`)}</dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums">
                    {summary.dimensions[dimension]}
                    <span className="text-xs font-normal text-textcolor-secondary"> / 100</span>
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="rounded-lg bg-black/5 p-4 text-sm text-textcolor-secondary">{t('empty')}</p>
        )}

        <p className="text-xs text-textcolor-secondary">{t('disclaimer')}</p>
      </div>
    </SectionCard>
  )
}
