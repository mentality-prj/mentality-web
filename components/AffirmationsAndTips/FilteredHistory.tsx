'use client'

import { useContext } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { FilterContext, SortContext } from '@/context/FilterContext'
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
  const { sort: SortOrder } = useContext(SortContext)
  const t = useTranslations('components.DailyCard')
  const { filter } = useContext(FilterContext)
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
