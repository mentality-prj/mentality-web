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
  /** next-intl namespace used by QuestionFormRadio (e.g. 'pages.AnxietyCheck') */
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
  /** 'percentage' renders Math.round((1 - score/maxScore) * 100)%; default 'raw' */
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
