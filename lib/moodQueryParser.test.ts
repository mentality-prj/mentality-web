import { parseMoodQuery } from './moodQueryParser'

describe('parseMoodQuery', () => {
  it('preserves page numbers after the first ten pages', () => {
    expect(parseMoodQuery({ page: '11' })).toEqual(
      expect.objectContaining({ page: 11, limit: 10, order: 'newest' })
    )
    expect(parseMoodQuery({ page: '42', order: 'oldest' })).toEqual(
      expect.objectContaining({ page: 42, order: 'oldest' })
    )
  })

  it('normalizes invalid, fractional and excessively large pages', () => {
    for (const page of ['-1', '0', '2.5', 'NaN', 'Infinity', 'malformed']) {
      expect(parseMoodQuery({ page }).page).toBe(1)
    }
    expect(parseMoodQuery({ page: '1000000' }).page).toBe(10_000)
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
