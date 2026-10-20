import { buildDailySummaries, isSubmittedToday } from '@/helpers/mood.helpers'
import { getLocalDayKey, getRecentLocalDayKeys, isValidTimeZone, millisecondsUntilNextLocalDay } from '@/utils/timeZone'

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
    // Offset-less timestamps would be parsed in different host zones by SSR and browser.
    expect(isSubmittedToday('2026-10-17T22:00:00', 'Europe/Warsaw')).toBe(false)
    expect(isSubmittedToday('2026-10-17T22:00:00Zgarbage', 'Europe/Warsaw')).toBe(false)
    expect(isSubmittedToday('2026-02-30T10:00:00Z', 'Europe/Warsaw', new Date('2026-03-02T10:00:00Z'))).toBe(false)
    expect(isSubmittedToday('2026-10-17T22:00:00+01:00', 'Europe/Warsaw', new Date('2026-10-17T22:30:00Z'))).toBe(false)
    expect(isSubmittedToday('2026-10-18T00:10:00+02:00', 'Europe/Warsaw', new Date('2026-10-17T22:30:00Z'))).toBe(true)
    expect(isSubmittedToday('2026-10-17T22:00:00.000Z', 'Mars/Phobos')).toBe(false)
    expect(isValidTimeZone('Europe/Kyiv')).toBe(true)
    expect(isValidTimeZone('Mars/Phobos')).toBe(false)
  })

  it.each([
    ['Warsaw spring', 'Europe/Warsaw', '2026-03-28T23:00:00.000Z', 23],
    ['Warsaw autumn', 'Europe/Warsaw', '2026-10-24T22:00:00.000Z', 25],
    ['Kyiv spring', 'Europe/Kyiv', '2026-03-28T22:00:00.000Z', 23],
    ['Kyiv autumn', 'Europe/Kyiv', '2026-10-24T21:00:00.000Z', 25],
  ])('schedules next local midnight across %s DST (%s)', (_, zone, now, hours) => {
    expect(millisecondsUntilNextLocalDay(new Date(now), zone)).toBe(hours * 60 * 60 * 1000)
  })

  it('refreshes at the exact next local day and fails closed for unknown zones', () => {
    expect(millisecondsUntilNextLocalDay(new Date('2026-10-17T21:59:59.500Z'), 'Europe/Warsaw')).toBe(500)
    expect(millisecondsUntilNextLocalDay(new Date('2026-10-17T22:00:00.000Z'), 'Europe/Warsaw')).toBe(
      24 * 60 * 60 * 1000
    )
    expect(millisecondsUntilNextLocalDay(new Date('2026-10-17T22:00:00Z'), null)).toBeNull()
    expect(millisecondsUntilNextLocalDay(new Date('2026-10-17T22:00:00Z'), 'Mars/Phobos')).toBeNull()
    expect(millisecondsUntilNextLocalDay(new Date('not-a-date'), 'Europe/Warsaw')).toBeNull()
  })

  it('enumerates civil days across midnight and DST without host-zone drift', () => {
    expect(getRecentLocalDayKeys(3, 'Europe/Warsaw', new Date('2026-10-17T22:30:00Z'))).toEqual([
      '2026-10-16',
      '2026-10-17',
      '2026-10-18',
    ])
    expect(getRecentLocalDayKeys(3, 'Europe/Warsaw', new Date('2026-03-29T22:30:00Z'))).toEqual([
      '2026-03-28',
      '2026-03-29',
      '2026-03-30',
    ])
    expect(getRecentLocalDayKeys(10, null)).toEqual([])
  })

  it('groups daily summaries by the selected local date', () => {
    const entries = [
      { createdAt: '2026-10-17T21:50:00.000Z', stressLevel: 2 },
      { createdAt: '2026-10-17T22:10:00.000Z', stressLevel: 4 },
    ]
    const summaries = buildDailySummaries(entries, 'Europe/Warsaw')
    expect(summaries).toMatchObject([
      { date: '2026-10-18', records: 1 },
      { date: '2026-10-17', records: 1 },
    ])
  })
})
