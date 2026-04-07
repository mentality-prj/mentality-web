import { parseLocalDate } from '@/helpers/userStatistics.helpers'

/**
 * Parses a date string to a millisecond timestamp.
 * Handles YYYY-MM-DD (local), space-separated datetimes, and ISO strings.
 * Returns Infinity for missing or invalid values so sorting stays stable.
 */
export function parseDateMs(value: string | undefined): number {
  if (!value) return Infinity
  const normalized = value.includes(' ') && !value.includes('T') ? value.replace(' ', 'T') : value
  const ms = parseLocalDate(normalized).getTime()
  return Number.isNaN(ms) ? Infinity : ms
}

/** Short date label for chart axis ticks, e.g. "Jan 15". */
export function formatDateShort(value: string | undefined, locale: string): string {
  const ms = parseDateMs(value)
  if (!Number.isFinite(ms)) return ''
  return new Date(ms).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

/** Long date label for chart tooltips, e.g. "15 January 2024". */
export function formatDateLong(value: string | undefined, locale: string): string {
  const ms = parseDateMs(value)
  if (!Number.isFinite(ms)) return String(value ?? '')
  return new Date(ms).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}
