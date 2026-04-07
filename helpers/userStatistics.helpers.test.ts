import { buildWeekdayMap, getMaxTagCount, getMoodHeatmapColor, parseLocalDate } from '@/helpers/userStatistics.helpers'
import { TopTag, WeekdayAverage } from '@/types/userStatistics'

describe('getMoodHeatmapColor', () => {
  it('returns bg-muted for undefined mood', () => {
    expect(getMoodHeatmapColor(undefined)).toBe('bg-muted')
  })

  it('returns bg-emerald-400 for mood >= 4.0', () => {
    expect(getMoodHeatmapColor(4.0)).toBe('bg-emerald-400')
    expect(getMoodHeatmapColor(5.0)).toBe('bg-emerald-400')
  })

  it('returns bg-emerald-300 for mood >= 3.5 and < 4.0', () => {
    expect(getMoodHeatmapColor(3.5)).toBe('bg-emerald-300')
    expect(getMoodHeatmapColor(3.9)).toBe('bg-emerald-300')
  })

  it('returns bg-yellow-300 for mood >= 3.0 and < 3.5', () => {
    expect(getMoodHeatmapColor(3.0)).toBe('bg-yellow-300')
    expect(getMoodHeatmapColor(3.4)).toBe('bg-yellow-300')
  })

  it('returns bg-orange-300 for mood >= 2.5 and < 3.0', () => {
    expect(getMoodHeatmapColor(2.5)).toBe('bg-orange-300')
    expect(getMoodHeatmapColor(2.9)).toBe('bg-orange-300')
  })

  it('returns bg-red-300 for mood < 2.5', () => {
    expect(getMoodHeatmapColor(1.0)).toBe('bg-red-300')
    expect(getMoodHeatmapColor(2.4)).toBe('bg-red-300')
  })
})

describe('getMaxTagCount', () => {
  const tags: TopTag[] = [
    { tag: 'work', count: 10 },
    { tag: 'sleep', count: 5 },
    { tag: 'sport', count: 2 },
  ]

  it('returns the highest count', () => {
    expect(getMaxTagCount(tags)).toBe(10)
  })

  it('returns 0 for an empty array', () => {
    expect(getMaxTagCount([])).toBe(0)
  })

  it('returns 0 when all counts are 0', () => {
    const zeroTags: TopTag[] = [{ tag: 'a', count: 0 }]
    expect(getMaxTagCount(zeroTags)).toBe(0)
  })
})

describe('parseLocalDate', () => {
  it('parses YYYY-MM-DD as a local date', () => {
    const date = parseLocalDate('2025-03-15')
    expect(date.getFullYear()).toBe(2025)
    expect(date.getMonth()).toBe(2) // March = 2
    expect(date.getDate()).toBe(15)
  })

  it('does not shift the day regardless of timezone', () => {
    const date = parseLocalDate('2025-01-01')
    expect(date.getDate()).toBe(1)
  })

  it('passes full ISO datetime strings through to native Date', () => {
    const iso = '2026-03-09T12:00:00.000Z'
    const date = parseLocalDate(iso)
    expect(date.getTime()).toBe(new Date(iso).getTime())
  })

  it('falls back to native Date for unexpected formats', () => {
    const input = 'March 15, 2025'
    const date = parseLocalDate(input)
    expect(date.getTime()).toBe(new Date(input).getTime())
  })
})

describe('buildWeekdayMap', () => {
  const data: WeekdayAverage[] = [
    { weekday: 1, mood: 3.2, count: 5 },
    { weekday: 5, mood: 3.8, count: 4 },
  ]

  it('builds a map keyed by weekday number', () => {
    const map = buildWeekdayMap(data)

    expect(map.size).toBe(2)
    expect(map.get(1)).toEqual({ weekday: 1, mood: 3.2, count: 5 })
    expect(map.get(5)).toEqual({ weekday: 5, mood: 3.8, count: 4 })
  })

  it('returns undefined for missing weekdays', () => {
    const map = buildWeekdayMap(data)
    expect(map.get(3)).toBeUndefined()
  })

  it('handles empty array', () => {
    const map = buildWeekdayMap([])
    expect(map.size).toBe(0)
  })
})
