import { formatDateLong, formatDateShort, parseDateMs } from '@/helpers/chart.helpers'

describe('parseDateMs', () => {
  it('returns Infinity for undefined', () => {
    expect(parseDateMs(undefined)).toBe(Infinity)
  })

  it('returns Infinity for empty string', () => {
    expect(parseDateMs('')).toBe(Infinity)
  })

  it('returns Infinity for invalid string', () => {
    expect(parseDateMs('not-a-date')).toBe(Infinity)
  })

  it('parses YYYY-MM-DD as a local date (no UTC shift)', () => {
    const ms = parseDateMs('2024-03-15')
    const d = new Date(ms)
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(2) // March = 2
    expect(d.getDate()).toBe(15)
  })

  it('parses space-separated datetime (SQL format)', () => {
    const ms = parseDateMs('2024-03-15 10:30:00')
    expect(Number.isFinite(ms)).toBe(true)
    const d = new Date(ms)
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(2)
    expect(d.getDate()).toBe(15)
  })

  it('parses ISO datetime string', () => {
    const ms = parseDateMs('2024-03-15T10:30:00.000Z')
    expect(Number.isFinite(ms)).toBe(true)
  })

  it('sorted order is stable when all dates are valid', () => {
    const dates = ['2024-03-20', '2024-03-10', '2024-03-15']
    const sorted = [...dates].sort((a, b) => parseDateMs(a) - parseDateMs(b))
    expect(sorted).toEqual(['2024-03-10', '2024-03-15', '2024-03-20'])
  })

  it('invalid dates sort to the end (Infinity)', () => {
    const dates = ['2024-03-15', 'bad', '2024-03-10']
    const sorted = [...dates].sort((a, b) => parseDateMs(a) - parseDateMs(b))
    expect(sorted[2]).toBe('bad')
  })
})

describe('formatDateShort', () => {
  it('returns empty string for undefined', () => {
    expect(formatDateShort(undefined, 'en-US')).toBe('')
  })

  it('returns empty string for invalid value', () => {
    expect(formatDateShort('not-a-date', 'en-US')).toBe('')
  })

  it('returns formatted short date for valid YYYY-MM-DD', () => {
    const result = formatDateShort('2024-01-15', 'en-US')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
  })

  it('returns formatted short date for space-separated datetime', () => {
    const result = formatDateShort('2024-01-15 10:30:00', 'en-US')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
  })
})

describe('formatDateLong', () => {
  it('returns empty string for undefined', () => {
    expect(formatDateLong(undefined, 'en-US')).toBe('')
  })

  it('returns raw value for invalid input', () => {
    expect(formatDateLong('bad-date', 'en-US')).toBe('bad-date')
  })

  it('returns formatted long date for valid YYYY-MM-DD', () => {
    const result = formatDateLong('2024-01-15', 'en-US')
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('returns formatted long date for space-separated datetime', () => {
    const result = formatDateLong('2024-01-15 10:30:00', 'en-US')
    expect(result).toContain('January')
    expect(result).toContain('2024')
  })
})
