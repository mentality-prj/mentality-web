import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { Insight } from '@/components/Insight'
import { getTodayObservations } from '@/requests/summary'
import { LocalizedText } from '@/types/achievements'

export const TodayObservations = async () => {
  const session = await auth()
  const res = await getTodayObservations(session)
  const observations = 'error' in res ? [] : (res.data ?? [])
  const t = await getTranslations('components.TodayObservations')
  return (
    <div className="background-alt-white rounded p-8">
      <div className="text-xl font-semibold text-textcolor-primary">{t('title')}</div>
      <div className="mt-6 flex flex-col gap-4">
        {observations.map((observation, index) => (
          <Insight key={index} text={observation as unknown as LocalizedText} />
        ))}
      </div>
    </div>
  )
}
