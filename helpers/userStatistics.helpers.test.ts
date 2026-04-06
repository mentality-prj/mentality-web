import { buildWeekdayMap, getMoodHeatmapColor, getTagBarWidthPercent } from '@/helpers/userStatistics.helpers'
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

describe('getTagBarWidthPercent', () => {
  const tags: TopTag[] = [
    { tag: 'work', count: 10 },
    { tag: 'sleep', count: 5 },
    { tag: 'sport', count: 2 },
  ]

  it('returns 100 for the most frequent tag', () => {
    expect(getTagBarWidthPercent(tags[0], tags)).toBe(100)
  })

  it('returns correct percentage for other tags', () => {
    expect(getTagBarWidthPercent(tags[1], tags)).toBe(50)
    expect(getTagBarWidthPercent(tags[2], tags)).toBe(20)
  })

  it('returns 0 when all counts are 0', () => {
    const zeroTags: TopTag[] = [{ tag: 'a', count: 0 }]
    expect(getTagBarWidthPercent(zeroTags[0], zeroTags)).toBe(0)
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
