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

/** Inclusive civil-date window; UTC arithmetic avoids host timezone/DST drift. */
export function getRecentLocalDayKeys(days: number, timeZone: string | null, now = new Date()): string[] {
  if (!Number.isInteger(days) || days < 1 || days > 31) return []
  const today = getLocalDayKey(now, timeZone)
  if (!today) return []
  const anchor = new Date(`${today}T12:00:00.000Z`)
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(anchor)
    date.setUTCDate(anchor.getUTCDate() - (days - 1 - index))
    return date.toISOString().slice(0, 10)
  })
}

/**
 * Milliseconds until the next civil midnight in the user's IANA zone.
 * Binary search over real instants handles 23- and 25-hour DST days without
 * assuming that the next local day starts after 24 UTC hours.
 */
export function millisecondsUntilNextLocalDay(now: Date, timeZone: string | null): number | null {
  const today = getLocalDayKey(now, timeZone)
  if (!today) return null

  let before = now.getTime()
  let after = before + 27 * 60 * 60 * 1000
  if (getLocalDayKey(new Date(after), timeZone) === today) return null

  while (after - before > 1) {
    const middle = before + Math.floor((after - before) / 2)
    if (getLocalDayKey(new Date(middle), timeZone) === today) before = middle
    else after = middle
  }

  return after - now.getTime()
}
