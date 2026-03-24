'use client'

import { useTranslations } from 'next-intl'

import { Filter } from '@/components/shared/Filter/Filter'
import { FilterSection } from '@/components/shared/Filter/FilterSection'
import { UserTagsFilterGroup } from '@/components/shared/Filter/UserTagsFilterGroup'
import { WeekdaysFilterGroup } from '@/components/shared/Filter/WeekdaysFilterGroup'
import { Sort } from '@/components/shared/Sort/Sort'
import { useMoodRecordsFilter } from '@/hooks/useMoodRecordsFilter'
import { weekOptions } from '@/mappers/weekdays.mapper'
import { SORT_ORDER } from '@/types/sort'
import { UserTag } from '@/types/tags'

type Props = {
  availableTags: UserTag[]
}

export function MoodRecordsFilter({ availableTags }: Props) {
  const { filters, setFilters, reset } = useMoodRecordsFilter({
    order: SORT_ORDER.NEWEST,
    tags: [],
    moodLevel: '',
    stressLevel: '',
    weekdays: [],
  })
  console.log('filters', filters)
  const { order: sort, tags, weekdays } = filters

  const t = useTranslations('components.Filter')

  return (
    <Filter
      variant="card"
      useFilters={() => ({ filters, setFilters, reset })}
      customSections={
        <>
          {availableTags.length > 0 && (
            <FilterSection title={t('by_tags')}>
              <UserTagsFilterGroup
                value={tags ?? []}
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
          <FilterSection title={t('by_week')}>
            <WeekdaysFilterGroup
              value={weekdays ?? []}
              options={weekOptions}
              onChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  weekdays: v,
                }))
              }
            />
          </FilterSection>
        </>
      }
      sup={
        <Sort
          id="mood-records-sort"
          value={sort}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, order: value }))}
        />
      }
    />
  )
}
