'use client'

import { useLocale, useTranslations } from 'next-intl'

import { useAffirmationsFilters } from '@/context/affirmationsFilterContext'
import { CustomCard } from '@/ds/components/CustomCard'
import { StarIcon } from '@/ds/icons/star'
import { Affirmation } from '@/types/affirmation'
import { SupportedLanguage } from '@/types/languages'

export interface AffirmationWithType extends Affirmation {
  type: 'affirmation' | 'tip'
}

export interface FilteredHistoryProps {
  items: AffirmationWithType[]
}

export const FilteredHistory = ({ items }: FilteredHistoryProps) => {
  const { filters } = useAffirmationsFilters()
  let filtered = items
  const SortOrder = filters.order
  const t = useTranslations('components.DailyCard')
  const filter = filters.tags
  const locale = useLocale() as SupportedLanguage

  const getSortedItems = () => {
    if (filter) {
      filtered = filtered.filter((item) => item.type === filter)
    }
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()

      return SortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {getSortedItems().map((item) => (
        <CustomCard
          key={item.id}
          variant="withDate"
          button={<StarIcon />}
          badge={t('type', { type: item.type })}
          date={new Date(item.createdAt).toLocaleDateString('uk-UA')}
          text={item.translations[`${locale}`]}
        />
      ))}
    </div>
  )
}
