import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'

import { DaysFilterWrapper } from './DaysFilterWrapper'

export function CalendarThoughts() {
  const t = useTranslations('MyThougtsPage.CalendarThoughtsNotes')
  //add func of count
  const count = 0

  return (
    <SectionCard
      title={t('title')}
      subtitle={t('subtitle')}
      subtitlePrefix={<span className="text-xl font-semibold text-textcolor-primary">{count}</span>}
    >
      here will be calendar component
      <DaysFilterWrapper />
    </SectionCard>
  )
}
