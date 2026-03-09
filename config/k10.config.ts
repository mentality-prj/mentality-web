import { TestConfig } from '@/components/features/TestsQuestionnarie/typesTestPage'
import { K10Level } from '@/types/k10'
import { StatusType } from '@/types/status.types'

// ─── Questions & options ─────────────────────────────────────────────────────

export const K10_QUESTIONS = [
  'During the past 30 days, how often did you feel tired out for no good reason?',
  'During the past 30 days, how often did you feel nervous?',
  'During the past 30 days, how often did you feel so nervous that nothing could calm you down?',
  'During the past 30 days, how often did you feel restless or fidgety?',
  'During the past 30 days, how often were you so restless you could not sit still?',
  'During the past 30 days, how often did you feel depressed?',
  'During the past 30 days, how often did you feel that everything was an effort?',
  'During the past 30 days, how often did you feel so sad that nothing could cheer you up?',
  'During the past 30 days, how often did you feel hopeless?',
  'During the past 30 days, how often did you feel worthless?',
] as const

export const K10_OPTIONS = [
  { label: 'None of the time', value: 1 },
  { label: 'A little of the time', value: 2 },
  { label: 'Some of the time', value: 3 },
  { label: 'Most of the time', value: 4 },
  { label: 'All of the time', value: 5 },
] as const

// ─── Scoring & levels ────────────────────────────────────────────────────────

export const K10_LEVEL_MAP: { min: number; max: number; label: K10Level }[] = [
  { min: 0, max: 20, label: 'green' },
  { min: 21, max: 29, label: 'yellow' },
  { min: 30, max: 34, label: 'orange' },
  { min: 35, max: 50, label: 'red' },
]

export const K10_LEVEL_LABELS: Record<K10Level, string> = {
  green: 'Low Distress',
  yellow: 'Mild Distress',
  orange: 'Moderate Distress',
  red: 'High Distress',
}

// ─── Limits ──────────────────────────────────────────────────────────────────

export const K10_TOTAL_QUESTIONS = K10_QUESTIONS.length
export const K10_MAX_SCORE = 50
export const K10_RESUBMIT_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

// ─── Result card style maps ───────────────────────────────────────────────────

export const K10_LEVEL_CARD_MAP: Record<K10Level, StatusType> = {
  green: 'success',
  yellow: 'success',
  orange: 'warn',
  red: 'error',
}

export const K10_LEVEL_BORDER_MAP: Record<K10Level, string> = {
  green: 'border border-inner-white border-border-success',
  yellow: 'border border-inner-white border-border-success',
  orange: 'border border-inner-white border-warning',
  red: 'border border-inner-white border-border-error',
}

// ─── TestConfig ───────────────────────────────────────────────────────────────
// Single source of truth for K10 test structure, consumed by the form and helpers.

export const K10_TEST_CONFIG: TestConfig<'radio'> = {
  id: 'k10',
  title: 'Stress & Well-being',
  type: 'radio',
  i18nNamespace: 'pages.K10',
  apiEndpoint: 'k10',
  maxScore: K10_MAX_SCORE,
  cooldownDays: 30,
  summaryField: 'message',
  cardTypeByIndex: [
    K10_LEVEL_CARD_MAP.green,
    K10_LEVEL_CARD_MAP.yellow,
    K10_LEVEL_CARD_MAP.orange,
    K10_LEVEL_CARD_MAP.red,
  ],
  cardBorderByIndex: [
    K10_LEVEL_BORDER_MAP.green,
    K10_LEVEL_BORDER_MAP.yellow,
    K10_LEVEL_BORDER_MAP.orange,
    K10_LEVEL_BORDER_MAP.red,
  ],
  questions: K10_QUESTIONS.map((text, i) => ({
    id: `k10_q${i}`,
    text,
    options: K10_OPTIONS.map((o) => ({ text: o.label, value: o.value })),
  })),
  scoring: { perOptionValue: true },
  resultMapping: K10_LEVEL_MAP.map((s) => ({
    min: s.min,
    max: s.max,
    label: K10_LEVEL_LABELS[s.label],
  })),
}
