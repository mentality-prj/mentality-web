import { parseMoodQuery } from '@/lib/moodQueryParser'
import { getSafePage } from '@/utils/getSafePage'

describe('mood history query filters', () => {
  it('combines high stress, low energy, tags, and weekdays without capping deep pagination', () => {
    const query = parseMoodQuery({
      page: '12',
      stressLevel: 'high',
      energyLevel: 'low',
      weekdays: 'weekDays,mon',
      tags: ['work,home', 'home'],
    })

    expect(query).toMatchObject({
      page: 12,
      limit: 10,
      stressMin: 4,
      stressMax: 4,
      energyMin: 2,
      energyMax: 2,
      tags: ['work', 'home'],
      weekdays: [1, 2, 3, 4, 5],
    })
  })

  it('supports multiple explicit days and weekends as a union', () => {
    expect(parseMoodQuery({ weekdays: ['mon,wed', 'weekends,sun'] }).weekdays).toEqual([1, 3, 6, 7])
  })

  it('ignores unrecognized levels and weekdays rather than sending invalid API values', () => {
    const query = parseMoodQuery({
      page: '-3',
      moodLevel: 'unknown',
      stressLevel: 'invalid',
      focusLevel: '99',
      weekdays: 'xyz,mon',
    })

    expect(query.page).toBe(1)
    expect(query.moodMin).toBeUndefined()
    expect(query.stressMin).toBeUndefined()
    expect(query.focusMin).toBeUndefined()
    expect(query.weekdays).toEqual([1])
  })

  it('encodes non-adjacent selected levels without expanding them into ranges', () => {
    const query = parseMoodQuery({
      moodLevel: 'veryBad,great',
      stressLevel: 'low,veryHigh',
      energyLevel: 'veryLow,high',
      focusLevel: 'low,veryHigh',
      weekdays: 'weekends',
    })

    expect(query.moodLevels).toEqual([1, 5])
    expect(query.stressLevels).toEqual([2, 5])
    expect(query.energyLevels).toEqual([1, 4])
    expect(query.focusLevels).toEqual([2, 5])
    expect(query.moodMin).toBeUndefined()
    expect(query.stressMin).toBeUndefined()
    expect(query.weekdays).toEqual([6, 7])
  })

  it('forwards the selected IANA timezone only when a weekday filter is active', () => {
    expect(parseMoodQuery({ weekdays: 'sun', timeZone: 'America/New_York' }).timeZone).toBe(
      'America/New_York'
    )
    expect(parseMoodQuery({ weekdays: 'weekends', timeZone: 'Europe/Warsaw' }).timeZone).toBe(
      'Europe/Warsaw'
    )
    expect(parseMoodQuery({ timeZone: 'Europe/Warsaw' }).timeZone).toBeUndefined()
  })

  it('preserves the selected server-side history order', () => {
    expect(parseMoodQuery({ order: 'oldest' }).order).toBe('oldest')
    expect(parseMoodQuery({ order: 'not-an-order' }).order).toBe('newest')
  })

  it('accepts only positive integer pages', () => {
    expect(getSafePage('11', 30)).toBe(11)
    expect(getSafePage('2.5', 30)).toBe(1)
    expect(getSafePage('Infinity', 30)).toBe(1)
    expect(getSafePage('999', 30)).toBe(30)
    expect(parseMoodQuery({ page: '2.5' }).page).toBe(1)
    expect(parseMoodQuery({ page: '1000000' }).page).toBe(10_000)
  })
})
