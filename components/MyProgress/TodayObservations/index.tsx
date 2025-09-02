import { getTranslations } from 'next-intl/server'

import { Insight } from '@/components/Insight'
import { mockTodayObservations } from '@/REST/mockApi'

export const TodayObservations = async () => {
  const observations = await mockTodayObservations()
  const t = await getTranslations('components.TodayObservations')
  return (
    <div className="rounded-default bg-surface-white p-8">
      <div className="text-xl font-semibold text-textcolor-primary">{t('title')}</div>
      <div className="mt-6 flex flex-col gap-4">
        {observations.map((observation, index) => (
          <Insight key={index} text={observation} />
        ))}
      </div>
    </div>
  )
}
