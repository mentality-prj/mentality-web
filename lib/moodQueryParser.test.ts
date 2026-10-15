import { parseMoodQuery } from './moodQueryParser'

describe('parseMoodQuery', () => {
  it('preserves page numbers after the first ten pages', () => {
    expect(parseMoodQuery({ page: '11' }).page).toBe(11)
    expect(parseMoodQuery({ page: '42', order: 'oldest' }).page).toBe(42)
    expect(parseMoodQuery({ page: '42', order: 'oldest' }).order).toBe('oldest')
  })

  it('normalizes invalid, fractional and excessively large pages', () => {
    for (const page of ['-1', '0', '2.5', 'NaN', 'Infinity', 'malformed']) {
      expect(parseMoodQuery({ page }).page).toBe(1)
    }
    expect(parseMoodQuery({ page: '1000000' }).page).toBe(10_000)
  })

  it('maps simultaneous stress, energy, mood, focus, tags and weekday filters', () => {
    const query = parseMoodQuery({
      page: '12',
      order: 'oldest',
      moodLevel: 'great',
      stressLevel: 'high',
      energyLevel: 'low',
      focusLevel: 'veryLow',
      tags: ['work,family', 'work'],
      weekdays: ['weekends,mon', 'sun'],
    })

    expect(query).toMatchObject({
      page: 12,
      order: 'oldest',
      moodMin: 5,
      moodMax: 5,
      stressMin: 4,
      stressMax: 4,
      energyMin: 2,
      energyMax: 2,
      focusMin: 1,
      focusMax: 1,
      tags: ['work', 'family'],
      weekdays: [6, 7, 1],
    })
  })

  it('ignores malformed metric and weekday selections instead of sending invalid DTO values', () => {
    const query = parseMoodQuery({
      moodLevel: 'nope',
      stressLevel: 'nope',
      energyLevel: 'none',
      focusLevel: 'bad',
      weekdays: ['invalid', 'mon'],
    })
    expect(query.moodMin).toBeUndefined()
    expect(query.stressMin).toBeUndefined()
    expect(query.energyMin).toBeUndefined()
    expect(query.focusMin).toBeUndefined()
    expect(query.weekdays).toEqual([1])
  })

  it('rejects unknown order and combines tags and ISO weekdays', () => {
    const parsed = parseMoodQuery({
      order: 'unexpected',
      tags: 'work,family,work',
      weekdays: 'weekDays,sun,invalid',
    })
    expect(parsed.order).toBe('newest')
    expect(parsed.tags).toEqual(['work', 'family'])
    expect(parsed.weekdays).toEqual([1, 2, 3, 4, 5, 7])
  })
})
