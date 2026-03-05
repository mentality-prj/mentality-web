// Re-export all test configuration from the canonical config file.
// Add new PHQ-9 test settings in config/phq9.config.ts.
export {
  PHQ9_QUESTIONS,
  PHQ9_OPTIONS,
  PHQ9_SEVERITY_MAP,
  PHQ9_SEVERITY_LABELS,
  PHQ9_RESUBMIT_COOLDOWN_MS,
  PHQ9_CRISIS_QUESTION_INDEX,
  PHQ9_MAX_SCORE,
  PHQ9_TEST_CONFIG,
} from '@/config/phq9.config'

import { Phq9HistoryEntry } from '@/types/phq9'

// TODO: remove when backend history endpoint returns real data
const PHQ9_STUB_SCORES = [20, 18, 16, 14, 12, 10, 9, 8, 7, 6, 5, 3] as const
function generatePhq9StubHistory(): Phq9HistoryEntry[] {
  const baseDate = new Date()
  // Anchor all stub entries at 10:00:00.000 UTC on the base day
  baseDate.setUTCHours(10, 0, 0, 0)
  const weekMs = 7 * 24 * 60 * 60 * 1000
  return PHQ9_STUB_SCORES.map((score, index) => {
    const weeksAgo = PHQ9_STUB_SCORES.length - 1 - index
    const date = new Date(baseDate.getTime() - weeksAgo * weekMs)
    return { date: date.toISOString(), score }
  })
}
export const PHQ9_STUB_HISTORY: Phq9HistoryEntry[] = generatePhq9StubHistory()
