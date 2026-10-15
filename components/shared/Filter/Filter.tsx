'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { Sort } from '@/components/shared/Sort/Sort'
import { filterOptions } from '@/constants/filter'
import { SORT_ORDER, SortOrder } from '@/types/sort'

import { ClearFiltersButton } from './ClearFiltersButton'
import { FilterOptionGroup } from './FilterOptionsGroup'
import { FilterSection } from './FilterSection'

interface BaseFilterProps<TFilters> {
  useFilters: () => {
    filters: TFilters
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>
    reset: () => void
  }
  customSections?: ReactNode
}

interface DefaultVariantProps<TFilters> extends BaseFilterProps<TFilters> {
  variant?: 'default'
  sup?: never
  tools?: never
}

interface CardVariantProps<TFilters> extends BaseFilterProps<TFilters> {
  variant: 'card'
  sup?: ReactNode
  tools?: ReactNode
}

type FilterProps<TFilters> = DefaultVariantProps<TFilters> | CardVariantProps<TFilters>

export const Filter = <TFilters extends { order: SortOrder }>({
  useFilters,
  variant = 'default',
  customSections,
  sup,
  tools: customTools,
}: FilterProps<TFilters>) => {
  const { filters, setFilters, reset } = useFilters()
  const { order: sort, ...otherFilters } = filters
  const hasSelections = Object.values(otherFilters).some((value) => {
    if (Array.isArray(value)) return value.length > 0
    return value != null && value !== ''
  })
  const hasActiveFilters = sort !== SORT_ORDER.NEWEST || hasSelections

  const t = useTranslations('components.Filter')

  const filterContent = (
    <>
      {customSections}

      {(Object.keys(otherFilters) as (keyof typeof filterOptions)[])
        .filter((k) => k in filterOptions)
        .map((k) => {
          const value = otherFilters[k as keyof typeof otherFilters] as string | string[]
          const options = filterOptions[`${k}`]
          const onChange = (v: string | string[]) => setFilters((prev) => ({ ...prev, [k]: v }))

          return (
            <FilterSection key={k} title={t(`by_${k}`)}>
              {Array.isArray(value) ? (
                <FilterOptionGroup multiple value={value} options={options} filterKey={k} onChange={onChange} />
              ) : (
                <FilterOptionGroup value={value} options={options} filterKey={k} onChange={onChange} />
              )}
            </FilterSection>
          )
        })}
    </>
  )

  if (variant === 'card') {
    return (
      <Card
        sup={
          sup || (
            <Sort
              id="filter-sort"
              value={sort}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, order: value }))}
            />
          )
        }
        tools={customTools || <ClearFiltersButton reset={reset} disabled={!hasActiveFilters} />}
      >
        <div className="mt-6 flex flex-col gap-sm">{filterContent}</div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-xs p-6">
      <div className="flex justify-between">
        <Sort
          id="filter-sort"
          value={sort}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, order: value }))}
        />
        <ClearFiltersButton reset={reset} disabled={!hasActiveFilters} />
      </div>
      {filterContent}
    </div>
  )
}
