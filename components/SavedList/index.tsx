'use client'

import { useTranslations } from 'next-intl'

import { Filter } from '../AffirmationsAndTips/Filter'
import { SectionCard } from '../ui/SectionCard'

import { FilteredList } from './FilteredList'

export const SavedList = () => {
  const t = useTranslations('SavedPage')

  const items: { id: string; date: string; tag: string; textContent: { uk: string; pl: string; en: string } }[] =
    JSON.parse(localStorage.getItem('savedItems') || '[]')
  return (
    <div className="">
      {items.length > 0 ? (
        <SectionCard className="grid gap-6 laptop:grid-cols-[1fr_2.5fr]">
          <Filter />
          <FilteredList items={items} />
        </SectionCard>
      ) : (
        <SectionCard>{t('empty')}</SectionCard>
      )}
    </div>
  )
}
