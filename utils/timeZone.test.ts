import { buildDailySummaries, isSubmittedToday } from '@/helpers/mood.helpers'
import { getLocalDayKey, isValidTimeZone } from '@/utils/timeZone'

describe('user-local calendar day', () => {
  it.each([
    ['Europe/Warsaw', '2026-10-17T22:30:00.000Z', '2026-10-18'],
    ['Europe/Kyiv', '2026-10-17T21:30:00.000Z', '2026-10-18'],
    ['Europe/Warsaw', '2026-03-29T00:30:00.000Z', '2026-03-29'],
    ['Europe/Warsaw', '2026-03-29T22:30:00.000Z', '2026-03-30'],
    ['Europe/Kyiv', '2026-03-29T21:30:00.000Z', '2026-03-30'],
    ['Europe/Warsaw', '2026-10-25T00:30:00.000Z', '2026-10-25'],
    ['Europe/Warsaw', '2026-10-25T23:30:00.000Z', '2026-10-26'],
  ])('%s maps %s to %s', (zone, input, expected) => {
    expect(getLocalDayKey(new Date(input), zone)).toBe(expected)
  })

  it('compares check-ins at local midnight rather than UTC midnight', () => {
    const now = new Date('2026-10-17T22:30:00.000Z')
    expect(isSubmittedToday('2026-10-17T22:01:00.000Z', 'Europe/Warsaw', now)).toBe(true)
    expect(isSubmittedToday('2026-10-17T21:59:59.000Z', 'Europe/Warsaw', now)).toBe(false)
  })

  it('fails closed for missing zones and invalid input', () => {
    expect(isSubmittedToday('2026-10-17T22:00:00.000Z', null)).toBe(false)
    expect(isSubmittedToday('invalid-iso', 'Europe/Warsaw')).toBe(false)
    expect(isSubmittedToday('2026-10-17T22:00:00.000Z', 'Mars/Phobos')).toBe(false)
    expect(isValidTimeZone('Europe/Kyiv')).toBe(true)
    expect(isValidTimeZone('Mars/Phobos')).toBe(false)
  })

  it('groups daily summaries by the selected local date', () => {
    expect(buildDailySummaries([
      { createdAt: '2026-10-17T21:50:00.000Z', stressLevel: 2 },
      { createdAt: '2026-10-17T22:10:00.000Z', stressLevel: 4 },
    ], 'Europe/Warsaw')).toMatchObject([
      { date: '2026-10-18', records: 1 },
      { date: '2026-10-17', records: 1 },
    ])
  })
})
