import { TestConfig } from '@/components/features/TestsQuestionnarie/typesTestPage'
import { Phq9HistoryEntry, Phq9Severity } from '@/types/phq9'

export const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
] as const

export const PHQ9_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
] as const

export const PHQ9_SEVERITY_MAP: { min: number; max: number; label: Phq9Severity }[] = [
  { min: 0, max: 4, label: 'minimal' },
  { min: 5, max: 9, label: 'mild' },
  { min: 10, max: 14, label: 'moderate' },
  { min: 15, max: 19, label: 'moderately-severe' },
  { min: 20, max: 27, label: 'severe' },
]

export const PHQ9_SEVERITY_LABELS: Record<Phq9Severity, string> = {
  minimal: 'Minimal',
  mild: 'Mild',
  moderate: 'Moderate',
  'moderately-severe': 'Moderately Severe',
  severe: 'Severe',
}

export const PHQ9_RESUBMIT_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours

export const PHQ9_CRISIS_QUESTION_INDEX = 8 // Q9: thoughts of self-harm

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

/**
 * PHQ-9 as a TestConfig<'radio'> — compatible with the TestsQuestionnarie infrastructure.
 * Questions are ordered; answers are stored by id `phq9_q0`…`phq9_q8`.
 */
export const PHQ9_TEST_CONFIG: TestConfig<'radio'> = {
  id: 'phq9',
  title: 'PHQ-9 Weekly Mental Check',
  type: 'radio',
  questions: PHQ9_QUESTIONS.map((text, i) => ({
    id: `phq9_q${i}`,
    text,
    options: PHQ9_OPTIONS.map((o) => ({ text: o.label, value: o.value })),
  })),
  scoring: { perOptionValue: true },
  resultMapping: PHQ9_SEVERITY_MAP.map((s) => ({
    min: s.min,
    max: s.max,
    label: PHQ9_SEVERITY_LABELS[s.label],
  })),
}
