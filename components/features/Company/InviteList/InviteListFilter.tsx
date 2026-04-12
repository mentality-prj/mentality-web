'use client'

import { useTranslations } from 'next-intl'

import { Filter } from '@/components/shared/Filter/Filter'
import { FilterSection } from '@/components/shared/Filter/FilterSection'
import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { useGroups } from '@/hooks/useGroups'
import { useInvitesFilter } from '@/hooks/useInvitesFilter'
import { SORT_ORDER } from '@/types/sort'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

export function InviteListFilter() {
  const { filters, setFilters, reset } = useInvitesFilter({
    order: SORT_ORDER.NEWEST,
    groups: [],
    dateFrom: '',
    dateTo: '',
  })

  const { items: groupOptions } = useGroups()
  const t = useTranslations('pages.Company.manager.inviteFilter')

  return (
    <div className="flex flex-col gap-xl">
      <Filter
        variant="card"
        useFilters={() => ({ filters, setFilters, reset })}
        customSections={
          <>
            <FilterSection title={t('by_date')}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="invite-filter-from" className="text-xs">
                    {t('dateFrom')}
                  </Label>
                  <Input
                    id="invite-filter-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="invite-filter-to" className="text-xs">
                    {t('dateTo')}
                  </Label>
                  <Input
                    id="invite-filter-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title={t('by_groups')}>
              <GroupSelector
                groups={groupOptions}
                selected={filters.groups}
                onChange={(v) => setFilters((prev) => ({ ...prev, groups: v }))}
              />
            </FilterSection>
          </>
        }
      />

      <InviteList
        groupFilter={filters.groups}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        order={filters.order}
      />
    </div>
  )
}
