import { TestConfig } from '@/components/features/TestsQuestionnarie/typesTestPage'
import { Gad7Level } from '@/types/gad7'
import { StatusType } from '@/types/status.types'

// ─── Questions & options ─────────────────────────────────────────────────────

export const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen',
] as const

export const GAD7_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
] as const

// ─── Scoring & levels ────────────────────────────────────────────────────────

export const GAD7_LEVEL_MAP: { min: number; max: number; label: Gad7Level }[] = [
  { min: 0, max: 4, label: 'minimal' },
  { min: 5, max: 9, label: 'mild' },
  { min: 10, max: 14, label: 'moderate' },
  { min: 15, max: 21, label: 'severe' },
]

export const GAD7_LEVEL_LABELS: Record<Gad7Level, string> = {
  minimal: 'Minimal Anxiety',
  mild: 'Mild Anxiety',
  moderate: 'Moderate Anxiety',
  severe: 'High Anxiety',
}

// ─── Limits ──────────────────────────────────────────────────────────────────

export const GAD7_TOTAL_QUESTIONS = GAD7_QUESTIONS.length
export const GAD7_MAX_SCORE = 21
export const GAD7_HIGH_SCORE_THRESHOLD = 15
export const GAD7_RESUBMIT_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

// ─── Result card style maps ───────────────────────────────────────────────────

export const GAD7_LEVEL_CARD_MAP: Record<Gad7Level, StatusType> = {
  minimal: 'success',
  mild: 'success',
  moderate: 'warn',
  severe: 'error',
}

export const GAD7_LEVEL_BORDER_MAP: Record<Gad7Level, string> = {
  minimal: 'border border-inner-white border-border-success',
  mild: 'border border-inner-white border-border-success',
  moderate: 'border border-inner-white border-warning',
  severe: 'border border-inner-white border-border-error',
}

// ─── TestConfig ───────────────────────────────────────────────────────────────
// Single source of truth for GAD-7 test structure, consumed by the form and helpers.

export const GAD7_TEST_CONFIG: TestConfig<'radio'> = {
  id: 'gad7',
  title: 'Anxiety Level',
  type: 'radio',
  i18nNamespace: 'pages.AnxietyCheck',
  apiEndpoint: 'gad7',
  maxScore: GAD7_MAX_SCORE,
  cooldownDays: 30,
  summaryField: 'recommendation',
  alertThreshold: GAD7_HIGH_SCORE_THRESHOLD,
  cardTypeByIndex: [
    GAD7_LEVEL_CARD_MAP.minimal,
    GAD7_LEVEL_CARD_MAP.mild,
    GAD7_LEVEL_CARD_MAP.moderate,
    GAD7_LEVEL_CARD_MAP.severe,
  ],
  cardBorderByIndex: [
    GAD7_LEVEL_BORDER_MAP.minimal,
    GAD7_LEVEL_BORDER_MAP.mild,
    GAD7_LEVEL_BORDER_MAP.moderate,
    GAD7_LEVEL_BORDER_MAP.severe,
  ],
  questions: GAD7_QUESTIONS.map((text, i) => ({
    id: `gad7_q${i}`,
    text,
    options: GAD7_OPTIONS.map((o) => ({ text: o.label, value: o.value })),
  })),
  scoring: { perOptionValue: true },
  resultMapping: GAD7_LEVEL_MAP.map((s) => ({
    min: s.min,
    max: s.max,
    label: GAD7_LEVEL_LABELS[s.label],
  })),
}
