'use client'

import { useCallback, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import { usePathname, useRouter } from '@/i18n/navigation'
import { SortOrder } from '@/types/sort'

export type InviteFilterState = {
  order: SortOrder
  groups: string[]
  dateFrom: string
  dateTo: string
}

export function useInvitesFilter(initial: InviteFilterState) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initialRef = useRef(initial)

  const filters = useMemo((): InviteFilterState => {
    const { order: initOrder, groups: initGroups, dateFrom: initDateFrom, dateTo: initDateTo } = initialRef.current
    const order = (searchParams.get('order') as SortOrder | null) ?? initOrder
    const groupsParam = searchParams.get('groups')
    const groups = groupsParam ? groupsParam.split(',') : initGroups
    const dateFrom = searchParams.get('dateFrom') ?? initDateFrom
    const dateTo = searchParams.get('dateTo') ?? initDateTo

    return { order, groups, dateFrom, dateTo }
  }, [searchParams])

  const setFilters = useCallback(
    (next: InviteFilterState | ((prev: InviteFilterState) => InviteFilterState)) => {
      const updates = typeof next === 'function' ? next(filters) : next
      const params = new URLSearchParams(searchParams.toString())

      if (updates.order) params.set('order', updates.order)
      else params.delete('order')

      if (updates.groups.length) params.set('groups', updates.groups.join(','))
      else params.delete('groups')

      if (updates.dateFrom) params.set('dateFrom', updates.dateFrom)
      else params.delete('dateFrom')

      if (updates.dateTo) params.set('dateTo', updates.dateTo)
      else params.delete('dateTo')

      params.set('page', '1')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [filters, pathname, router, searchParams]
  )

  const reset = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('order')
    params.delete('groups')
    params.delete('dateFrom')
    params.delete('dateTo')
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  return { filters, setFilters, reset }
}
