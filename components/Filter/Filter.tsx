'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'

import Card from '@/components/Cards/Card'
import { Sort } from '@/components/Sort/Sort'
import { filterOptions } from '@/constants/filter'
import { SortOrder } from '@/types/sort'

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
  hideTitle?: boolean
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
  hideTitle = false,
  sup,
  tools: customTools,
}: FilterProps<TFilters>) => {
  const { filters, setFilters, reset } = useFilters()
  const { order: sort, ...otherFilters } = filters

  const t = useTranslations('components.Filter')

  const filterContent = (
    <>
      {customSections}

      {(Object.keys(otherFilters) as (keyof typeof filterOptions)[])
        .filter((k) => k in filterOptions)
        .map((k) => {
          const value = otherFilters[k as keyof typeof otherFilters] as string
          const options = filterOptions[`${k}`]

          return (
            <FilterSection key={k} title={t(`by_${k}`)}>
              <FilterOptionGroup
                value={value}
                options={options}
                filterKey={k as 'tags' | 'categories' | 'moodLevel' | 'stressLevel' | 'week'}
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
        tools={customTools || <ClearFiltersButton reset={reset} />}
      >
        <div className="mt-6 flex flex-col gap-sm">{filterContent}</div>
      </Card>
    )
  }

  return (
    <div className="border-outline-secondary flex max-h-fit flex-col gap-5 rounded-md border p-6">
      {!hideTitle && (
        <div className="flex justify-between">
          <div>{t('title')}</div>
          <ClearFiltersButton reset={reset} />
        </div>
      )}

      {filterContent}

      <hr />
      <Sort
        id="filter-sort"
        value={sort}
        onValueChange={(value) => setFilters((prev) => ({ ...prev, order: value }))}
      />
    </div>
  )
}
