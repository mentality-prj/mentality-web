'use client'

import { useLocale, useTranslations } from 'next-intl'

import { useSavedFilters } from '@/context/savedFilterContext'
import { CustomCard } from '@/ds/components/CustomCard'
import { StarIcon } from '@/ds/icons/star'
import { SupportedLanguage } from '@/types/languages'

import { FilteredHistoryProps } from '../AffirmationsAndTips/FilteredHistory'

export const FilteredList = ({ items }: FilteredHistoryProps) => {
  const { filters } = useSavedFilters()
  const SortOrder = filters.order
  const filter = filters.tags
  const t = useTranslations('components.DailyCard')
  const locale = useLocale() as SupportedLanguage
  const getSortedItems = () => {
    if (filter) {
      items = items.filter((item) => item.type === filter)
    }
    return [...items].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()

      return SortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })
  }
  return (
    <div className="flex flex-col gap-6">
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
