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

  it('accepts only positive integer pages', () => {
    expect(getSafePage('11', 30)).toBe(11)
    expect(getSafePage('2.5', 30)).toBe(1)
    expect(getSafePage('Infinity', 30)).toBe(1)
    expect(getSafePage('999', 30)).toBe(30)
  })
})
