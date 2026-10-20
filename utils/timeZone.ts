/** Validated browser IANA timezone for optional local-day actions. */
export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== 'string' || !value || value.length > 128) return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value })
    return true
  } catch {
    return false
  }
}

export function getVerifiedBrowserTimeZone(): string | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return isValidTimeZone(zone) ? zone : null
  } catch {
    return null
  }
}

export function getLocalDayKey(date: Date, timeZone: string | null): string | null {
  if (!isValidTimeZone(timeZone) || !Number.isFinite(date.getTime())) return null
  const fields = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(date)
      .filter(({ type }) => type === 'year' || type === 'month' || type === 'day')
      .map(({ type, value }) => [type, value])
  )
  return `${fields.year}-${fields.month}-${fields.day}`
}
