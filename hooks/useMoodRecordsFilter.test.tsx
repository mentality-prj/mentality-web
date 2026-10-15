import { act, renderHook } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'

import { useMoodRecordsFilter } from '@/hooks/useMoodRecordsFilter'
import { usePathname, useRouter } from '@/i18n/navigation'
import { SORT_ORDER } from '@/types/sort'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

jest.mock('@/i18n/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}))

const initial: Parameters<typeof useMoodRecordsFilter>[0] = {
  order: SORT_ORDER.NEWEST,
  moodLevel: [],
  stressLevel: [],
  energyLevel: [],
  focusLevel: [],
  tags: [],
  weekdays: [],
}

describe('useMoodRecordsFilter', () => {
  const replace = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ replace })
    ;(usePathname as jest.Mock).mockReturnValue('/mood-tracker')
  })

  it('keeps every repeated filter value in the selected chips and on subsequent updates', () => {
    const query = new URLSearchParams(
      'moodLevel=veryBad&moodLevel=great&energyLevel=veryLow&energyLevel=veryHigh&weekdays=mon&weekdays=wed&tags=calm&tags=work&order=oldest&order=newest'
    )
    ;(useSearchParams as jest.Mock).mockReturnValue(query)

    const { result } = renderHook(() => useMoodRecordsFilter(initial))
    expect(result.current.filters.moodLevel).toEqual(['veryBad', 'great'])
    expect(result.current.filters.energyLevel).toEqual(['veryLow', 'veryHigh'])
    expect(result.current.filters.weekdays).toEqual(['mon', 'wed'])
    expect(result.current.filters.tags).toEqual(['calm', 'work'])
    expect(result.current.filters.order).toBe(SORT_ORDER.OLDEST)

    act(() => result.current.setFilters((previous) => ({ ...previous, tags: [...(previous.tags ?? []), 'evening'] })))

    const outgoing = new URL(replace.mock.calls[0][0] as string, 'http://localhost')
    expect(outgoing.searchParams.get('moodLevel')).toBe('veryBad,great')
    expect(outgoing.searchParams.get('energyLevel')).toBe('veryLow,veryHigh')
    expect(outgoing.searchParams.get('weekdays')).toBe('mon,wed')
    expect(outgoing.searchParams.get('tags')).toBe('calm,work,evening')
    expect(outgoing.searchParams.get('order')).toBe('oldest')
    expect(outgoing.searchParams.get('page')).toBe('1')
  })

  it('combines repeated keys and comma-separated entries without duplicates', () => {
    const query = new URLSearchParams('moodLevel=bad,good&moodLevel=great&tags=calm,work&tags=work')
    ;(useSearchParams as jest.Mock).mockReturnValue(query)

    const { result } = renderHook(() => useMoodRecordsFilter(initial))

    expect(result.current.filters.moodLevel).toEqual(['bad', 'good', 'great'])
    expect(result.current.filters.tags).toEqual(['calm', 'work'])
  })
})
