/**
 * Resolve the user's local IANA time zone for mood-history weekday filters.
 * MongoDB applies daylight-saving transitions using this zone.
 */
export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}
