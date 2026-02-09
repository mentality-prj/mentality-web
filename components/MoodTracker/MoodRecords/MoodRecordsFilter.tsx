'use client'

import { useTranslations } from 'next-intl'

import { ClearFiltersButton } from '@/components/Filter/ClearFiltersButton'
import { FilterOptionGroup } from '@/components/Filter/FilterOptionsGroup'
import { FilterSection } from '@/components/Filter/FilterSection'
import { UserTagsFilterGroup } from '@/components/Filter/UserTagsFilterGroup'
import { Sort } from '@/components/Sort/Sort'
import { filterOptions } from '@/constants/filter'
import { useMoodRecordsFilters } from '@/context/moodRecordsFilterContext'
import { UserTag } from '@/types/tags'

import Card from '../../Cards/Card'

type Props = {
  availableTags: UserTag[]
}

export function MoodRecordsFilter({ availableTags }: Props) {
  const { filters, setFilters, reset } = useMoodRecordsFilters()
  const { order: sort, tags } = filters

  const t = useTranslations('components.Filter')

  return (
    <Card
      sup={
        <Sort
          id="mood-records-sort"
          value={sort}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, order: value }))}
        />
      }
      tools={<ClearFiltersButton reset={reset} />}
    >
      <div className="mt-6 flex flex-col gap-sm">
        {/* User Tags Filter */}
        {availableTags.length > 0 && (
          <FilterSection title={t('by_tags')}>
            <UserTagsFilterGroup
              value={tags}
              tags={availableTags}
              onChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  tags: v,
                }))
              }
            />
          </FilterSection>
        )}

        {/* Mood Level Filter */}
        <FilterSection title={t('by_moodLevel')}>
          <FilterOptionGroup
            value={filters.moodLevel}
            options={filterOptions.moodLevel}
            onChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                moodLevel: v as typeof prev.moodLevel,
              }))
            }
          />
        </FilterSection>

        {/* Stress Level Filter */}
        <FilterSection title={t('by_stressLevel')}>
          <FilterOptionGroup
            value={filters.stressLevel}
            options={filterOptions.stressLevel}
            onChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                stressLevel: v as typeof prev.stressLevel,
              }))
            }
          />
        </FilterSection>

        {/* Week Filter */}
        <FilterSection title={t('by_week')}>
          <FilterOptionGroup
            value={filters.week}
            options={filterOptions.week}
            onChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                week: v as typeof prev.week,
              }))
            }
          />
        </FilterSection>
      </div>
    </Card>
  )
}
