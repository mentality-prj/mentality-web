import { getTranslations } from 'next-intl/server'

import { mockAffirmations, mockTips } from '@/REST/mockApi'

import { DailyCard } from '../ui/DailyCard'
import { SectionCard } from '../ui/SectionCard'

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
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <DailyCard
                variant="previous"
                date={item.createdAt}
                key={item.id}
                tag={item.type}
                textContent={item.translations.uk}
              />
            ))}
          </div>
        </SectionCard>
      ) : (
        <SectionCard title={t('sectionCard.title')} subtitle={t('sectionCard.subtitle')} />
      )}
    </>
  )
}
