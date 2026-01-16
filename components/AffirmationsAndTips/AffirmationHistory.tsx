import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { useAffirmationsFilters } from '@/context/affirmationsFilterContext'
import { SectionCard } from '@/ds/components/SectionCard'
import { getAffirmations } from '@/requests/affirmations'
import { getTips } from '@/requests/tips'

import { Filter } from '../Filter'

import { AffirmationWithType, FilteredHistory } from './FilteredHistory'

export const AffirmationHistory = async () => {
  const session = await auth()
  const affirmRes = await getAffirmations(session, 1, 100)
  const tipsRes = await getTips(session, 1, 100)

  const affirmationsData = 'error' in affirmRes ? [] : (affirmRes.data?.items ?? [])
  const tipsData = 'error' in tipsRes ? [] : (tipsRes.data?.items ?? [])

  const items: AffirmationWithType[] = [
    ...affirmationsData.map((item) => ({ ...item, type: 'affirmation' as const })),
    ...tipsData.map((item) => ({ ...item, type: 'tip' as const })),
  ]

  const t = await getTranslations('common.SectionCard')
  return (
    <>
      {items.length > 0 ? (
        <SectionCard title={t('title', { title: 'affirmation' })}>
          <div className="grid gap-default laptop:grid-cols-[1fr_2.5fr]">
            <Filter useFilters={useAffirmationsFilters} />
            <FilteredHistory items={items} />
          </div>
        </SectionCard>
      ) : (
        <SectionCard
          title={t('title', { title: 'affirmation' })}
          subtitle={t('subtitle', { subtitle: 'affirmation' })}
        />
      )}
    </>
  )
}
