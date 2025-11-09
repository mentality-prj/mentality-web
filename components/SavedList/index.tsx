'use client'

import { useTranslations } from 'next-intl'

import { logger } from '@/lib/logger'

import { Filter } from '../AffirmationsAndTips/Filter'
import { AffirmationWithType } from '../AffirmationsAndTips/FilteredHistory'
import { SectionCard } from '../ui/SectionCard'

import { FilteredList } from './FilteredList'

export const SavedList = () => {
  const t = useTranslations('SavedPage')

  let items: AffirmationWithType[] = []
  if (typeof window !== 'undefined') {
    try {
      items = JSON.parse(localStorage.getItem('savedItems') || '[]')
    } catch (error) {
      logger.error('Failed to parse saved items from localStorage', error)
      items = []
    }
  }

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
