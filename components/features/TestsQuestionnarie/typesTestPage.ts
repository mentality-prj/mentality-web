import { StatusType } from '@/types/status.types'

export type ChoiceType = 'checkbox' | 'radio'
export type QuestionGroup = 'intellectual' | 'behavioral' | 'emotional' | 'physiological'

export interface Option {
  text: string
  value: number
}

export interface BaseQuestion {
  id: string
  text: string
}

export interface CheckboxQuestionWithGroups extends BaseQuestion {
  group: QuestionGroup
  options?: never
}

export interface RadioQuestion extends BaseQuestion {
  options: Option[]
  group?: never
}

export type QuestionTypes = CheckboxQuestionWithGroups | RadioQuestion

export interface TestConfig<T extends ChoiceType> {
  id: string
  title: string
  type: T
  /** Optional next-intl namespace for test page translations (e.g. 'pages.AnxietyCheck') */
  i18nNamespace?: string
  /** Relative backend path for POST answers and GET /history, e.g. 'k10' */
  apiEndpoint?: string
  /** Maximum possible score — used for history chart Y-axis and percentage format */
  maxScore?: number
  /** Cooldown period in days before user can retake the test (default: 1) */
  cooldownDays?: number

  // ─── Result card customization ─────────────────────────────────────────────
  /** StatusType per resultMapping index — overrides the default color derivation */
  cardTypeByIndex?: StatusType[]
  /** Border class per resultMapping index — overrides the default border */
  cardBorderByIndex?: string[]
  /**
   * Score display format: 'raw' (default) or 'percentage'
   *
   * 'percentage' renders Math.round((1 - score/maxScore) * 100)%
   * This INVERTS the semantic meaning of the score:
   * - High PHQ-9 score (e.g., 27) = high depression severity, but displays as 0% (low wellness)
   * - Low PHQ-9 score (e.g., 0) = no depression, displays as 100% (high wellness)
   *
   * This inversion transforms severity scores into wellness percentages, which may be
   * intentional for user-friendly UI display, but the formula converts severity into
   * its opposite. Ensure this behavior is intentional before using 'percentage' format.
   */
  scoreFormat?: 'raw' | 'percentage'
  /** Key in the API response to use as summary/recommendation text (e.g. 'aiSummary') */
  summaryField?: string
  /** Key in the API response to use as alert/crisis text (e.g. 'crisisNotice') */
  alertField?: string
  /** Score at or above which staticAlertText is shown */
  alertThreshold?: number
  /** Static alert text shown when score >= alertThreshold (pass a translated string from the page) */
  staticAlertText?: string

  // ─── Result card labels (pass translated strings from the page) ────────────
  scoreLabel?: string
  categoryTitle?: string
  summaryTitle?: string
  ctaRetryLabel?: string
  ctaProgramLabel?: string

  groupWeights?: T extends 'checkbox' ? Record<QuestionGroup, number> : never
  questions: T extends 'checkbox' ? CheckboxQuestionWithGroups[] : RadioQuestion[]
  scoring: {
    groupWeight?: boolean // checkbox
    perOptionValue?: boolean // radio
  }
  resultMapping: ResultMapping[]
}

export interface ResultMapping {
  min: number
  max: number
  label: string
}
