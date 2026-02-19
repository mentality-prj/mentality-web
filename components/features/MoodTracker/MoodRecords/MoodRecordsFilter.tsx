'use client'

import { useTranslations } from 'next-intl'

import { Filter } from '@/components/shared/Filter/Filter'
import { FilterSection } from '@/components/shared/Filter/FilterSection'
import { UserTagsFilterGroup } from '@/components/shared/Filter/UserTagsFilterGroup'
import { Sort } from '@/components/shared/Sort/Sort'
import { useMoodRecordsFilters } from '@/context/moodRecordsFilterContext'
import { UserTag } from '@/types/tags'

type Props = {
  availableTags: UserTag[]
}

export function MoodRecordsFilter({ availableTags }: Props) {
  const { filters, setFilters } = useMoodRecordsFilters()
  const { order: sort, tags } = filters

  const t = useTranslations('components.Filter')

  return (
    <Filter
      variant="card"
      useFilters={useMoodRecordsFilters}
      customSections={
        availableTags.length > 0 && (
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
        )
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
