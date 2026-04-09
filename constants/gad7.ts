// Re-export all test configuration from the canonical config file.
// Add new GAD-7 test settings in config/gad7.config.ts.
export {
  GAD7_QUESTIONS,
  GAD7_OPTIONS,
  GAD7_LEVEL_MAP,
  GAD7_LEVEL_LABELS,
  GAD7_TOTAL_QUESTIONS,
  GAD7_HIGH_SCORE_THRESHOLD,
  GAD7_RESUBMIT_COOLDOWN_MS,
  GAD7_MAX_SCORE,
  GAD7_TEST_CONFIG,
} from '@/config/gad7.config'

import { routing } from '@/i18n/routing'
import { Gad7HistoryEntry } from '@/types/gad7'

// TODO: remove when backend history endpoint returns real data
const GAD7_STUB_SCORES = [18, 16, 14, 12, 10, 8, 6, 5, 4, 3] as const
function generateGad7StubHistory(): Gad7HistoryEntry[] {
  const baseDate = new Date()
  baseDate.setUTCHours(10, 0, 0, 0)
  const weekMs = 7 * 24 * 60 * 60 * 1000
  return GAD7_STUB_SCORES.map((score, index) => {
    const weeksAgo = GAD7_STUB_SCORES.length - 1 - index
    const date = new Date(baseDate.getTime() - weeksAgo * weekMs)
    const label = Object.fromEntries(routing.locales.map((l) => [l, ''])) as Gad7HistoryEntry['label']
    return { date: date.toISOString(), score, label }
  })
}
export const GAD7_STUB_HISTORY: Gad7HistoryEntry[] = generateGad7StubHistory()
