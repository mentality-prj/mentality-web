'use client'

import { useLocale, useTranslations } from 'next-intl'

import { useAffirmationsFilters } from '@/context/affirmationsFilterContext'
import CustomCard from '@/ds/components/CustomCard'
import { StarIcon } from '@/ds/icons/star'
import { Affirmation } from '@/types/affirmation'
import { SupportedLanguage } from '@/types/languages'
import { SORT_ORDER } from '@/types/sort'

export interface AffirmationWithType extends Affirmation {
  type: string
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

      return SortOrder === SORT_ORDER.NEWEST ? timeB - timeA : timeA - timeB
    })
  }

  return (
    <div className="grid grid-cols-1 gap-sm">
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
