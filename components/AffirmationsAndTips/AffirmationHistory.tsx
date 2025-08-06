import { getTranslations } from 'next-intl/server'

import { mockAffirmations, mockTips } from '@/REST/mockApi'

import { DailyCard } from '../ui/DailyCard'
import { SectionCard } from '../ui/SectionCard'

import { Filter } from './Filter'
import { FilteredHistory } from './FilteredHistory'

export const AffirmationHistory = async () => {
  const affirmationsData = await mockAffirmations()
  const tipsData = await mockTips()
  const items = [
    ...affirmationsData.map((item) => ({ ...item, type: 'affirmation' })),
    ...tipsData.map((item) => ({ ...item, type: 'tip' })),
  ]

  const t = await getTranslations('AffirmationsPage')
  return (
    <>
      {items.length > 0 ? (
        <SectionCard title={t('sectionCard.title')}>
          <div className="grid gap-6 laptop:grid-cols-[1fr_2.5fr]">
            <Filter />
            <FilteredHistory items={items} />
          </div>
        </SectionCard>
      ) : (
        <SectionCard title={t('sectionCard.title')} subtitle={t('sectionCard.subtitle')} />
      )}
    </>
  )
}
