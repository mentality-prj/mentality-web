import { TopTag, WeekdayAverage } from '@/types/userStatistics'

/**
 * Returns a Tailwind color class based on mood value (1.0–5.0 scale).
 * Used for heatmap cell backgrounds.
 */
export function getMoodHeatmapColor(mood: number | undefined): string {
  if (mood == null) return 'bg-muted'
  if (mood >= 4.0) return 'bg-emerald-400'
  if (mood >= 3.5) return 'bg-emerald-300'
  if (mood >= 3.0) return 'bg-yellow-300'
  if (mood >= 2.5) return 'bg-orange-300'
  return 'bg-red-300'
}

/**
 * Returns the maximum count among tags, or 0 if the array is empty.
 * Precompute once in the caller to avoid O(n²) per-tag scans.
 */
export function getMaxTagCount(tags: TopTag[]): number {
  if (tags.length === 0) return 0
  return Math.max(...tags.map((t) => t.count))
}

/**
 * Parses a date string as a local date (avoids UTC off-by-one in some timezones).
 * For date-only strings (YYYY-MM-DD) constructs a local date to prevent timezone shift.
 * For datetime strings (with T) and other formats, delegates to native Date parsing.
 */
export function parseLocalDate(dateStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const localDate = new Date(year, month - 1, day)
    if (localDate.getFullYear() === year && localDate.getMonth() === month - 1 && localDate.getDate() === day) {
      return localDate
    }
  }
  return new Date(dateStr)
}

/**
 * Builds a lookup map from weekday number (ISO 1–7) to its average data.
 */
export function buildWeekdayMap(data: WeekdayAverage[]): Map<number, WeekdayAverage> {
  return new Map(data.map((d) => [d.weekday, d]))
}
