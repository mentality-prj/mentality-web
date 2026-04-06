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
 * Calculates bar width percentage for a tag relative to the most frequent tag.
 */
export function getTagBarWidthPercent(tag: TopTag, tags: TopTag[]): number {
  const maxCount = Math.max(...tags.map((t) => t.count))
  if (maxCount === 0) return 0
  return (tag.count / maxCount) * 100
}

/**
 * Builds a lookup map from weekday number (ISO 1–7) to its average data.
 */
export function buildWeekdayMap(data: WeekdayAverage[]): Map<number, WeekdayAverage> {
  return new Map(data.map((d) => [d.weekday, d]))
}
