'use client'

import { useTranslations } from 'next-intl'

import { Sort } from '@/components/Sort'
import { filterOptions } from '@/constants/filter'

import { ClearFiltersButton } from './ClearFiltersButton'
import { FilterOptionGroup } from './FilterOptionsGroup'
import { FilterSection } from './FilterSection'

interface FilterProps<TFilters> {
  useFilters: () => {
    filters: TFilters
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>
    reset: () => void
  }
}

export const Filter = <TFilters extends { order: 'newest' | 'oldest' }>({ useFilters }: FilterProps<TFilters>) => {
  const { filters, setFilters, reset } = useFilters()
  const { order: sort, ...otherFilters } = filters
  const hasActiveFilters = Object.values(otherFilters).some(Boolean)

  const t = useTranslations('components.Filter')

  return (
    <div className="flex max-h-fit flex-col gap-5 rounded-md border border-outline-secondary p-6">
      <div className="flex justify-between">
        <div>{t('title')}</div>

        <ClearFiltersButton hasActiveFilters={hasActiveFilters} reset={reset} sort={sort} />
      </div>

      {(Object.keys(otherFilters) as (keyof typeof filterOptions)[]).map((k) => {
        const value = otherFilters[k as keyof typeof otherFilters] as string
        const options = filterOptions[`${k}`]

        return (
          <FilterSection key={k} title={t(`by_${k}`)}>
            <FilterOptionGroup
              value={value}
              options={options}
              onChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  [k]: v,
                }))
              }
            />
          </FilterSection>
        )
      })}

      <hr />
      <Sort
        id="affirmations-and-tips-sort"
        value={sort}
        onValueChange={(value) => setFilters((prev) => ({ ...prev, order: value }))}
      />
    </div>
  )
}
