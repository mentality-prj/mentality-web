'use client'

import { useContext } from 'react'

import { DailyCard } from '@/components/DailyCard'
import { FilterContext, SortContext } from '@/context/FilterContext'
import { Affirmation } from '@/types/affirmation'

export interface AffirmationWithType extends Affirmation {
  type: 'affirmation' | 'tip'
}

export interface FilteredHistoryProps {
  items: AffirmationWithType[]
}

export const FilteredHistory = ({ items }: FilteredHistoryProps) => {
  const { sort: SortOrder } = useContext(SortContext)
  const { filter } = useContext(FilterContext)

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
        <DailyCard variant="previous" key={item.id} {...item} />
      ))}
    </div>
  )
}
