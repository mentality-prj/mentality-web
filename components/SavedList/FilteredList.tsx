'use client'

import { useContext } from 'react'

import { FilterContext, SortContext } from '@/context/FilterContext'

import { DailyCard } from '../ui/DailyCard'

interface FilteredListProps {
  items: { id: string; date: string; tag: string; textContent: { uk: string; pl: string; en: string } }[]
}

export const FilteredList = ({ items }: FilteredListProps) => {
  const { sort: SortOrder } = useContext(SortContext)
  const { filter } = useContext(FilterContext)
  const getSortedItems = () => {
    if (filter) {
      items = items.filter((item) => item.tag === filter)
    }
    return [...items].sort((a, b) => {
      const timeA = new Date(a.date).getTime()
      const timeB = new Date(b.date).getTime()

      return SortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })
  }
  return (
    <div className="flex flex-col gap-6">
      {getSortedItems().map((item) => (
        <DailyCard
          variant="previous"
          date={item.date}
          key={item.id}
          id={item.id}
          tag={item.tag}
          textContent={item.textContent}
        />
      ))}
    </div>
  )
}
