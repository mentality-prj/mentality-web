'use client'

import { useTranslations } from 'next-intl'

import { AffirmationWithType } from '@/components/AffirmationsAndTips/FilteredHistory'
import { useSavedFilters } from '@/context/savedFilterContext'
import { SectionCard } from '@/ds/components/SectionCard'

import { Filter } from '../Filter'

import { FilteredList } from './FilteredList'

export const SavedList = () => {
  const t = useTranslations('common.title')
  const items: AffirmationWithType[] = JSON.parse(localStorage.getItem('savedItems') || '[]')
  return (
    <div className="">
      {items.length > 0 ? (
        <SectionCard className="grid gap-default laptop:grid-cols-[1fr_2.5fr]">
          <Filter useFilters={useSavedFilters} />
          <FilteredList items={items} />
        </SectionCard>
      ) : (
        <SectionCard>{t('EmptySavedPage')}</SectionCard>
      )}
    </div>
  )
}
