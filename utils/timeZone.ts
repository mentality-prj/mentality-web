/** Shared IANA validation for browser and server. */
export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== 'string' || !value || value.length > 128) return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value })
    return true
  } catch {
    return false
  }
}

export const USER_TIME_ZONE_COOKIE = 'dzvin_time_zone'

export function getVerifiedBrowserTimeZone(): string | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return isValidTimeZone(zone) ? zone : null
  } catch {
    return null
  }
}

/** Kept for legacy history filters; not used to gate daily submissions. */
export function getBrowserTimeZone(): string {
  return getVerifiedBrowserTimeZone() ?? 'UTC'
}

export function getLocalDayKey(date: Date, timeZone: string | null | undefined): string | null {
  if (!isValidTimeZone(timeZone) || Number.isNaN(date.getTime())) return null
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(date)
      .filter(({ type }) => ['year', 'month', 'day'].includes(type))
      .map(({ type, value }) => [type, value])
  )
  return `${parts.year}-${parts.month}-${parts.day}`
}
