import { SupportedLanguage } from './languages'

export type Phq9AnswerValue = 0 | 1 | 2 | 3

export type Phq9Severity = 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe'

export interface Phq9SubmitPayload {
  answers: Phq9AnswerValue[]
}

export interface Phq9ApiResponse {
  score: number
  severity: Phq9Severity
  aiSummary: Record<SupportedLanguage, string> | null
  crisisNotice: Record<SupportedLanguage, string> | null
  submittedAt: string
}

export interface Phq9HistoryEntry {
  date: string
  score: number
}

export type Phq9Answers = [
  Phq9AnswerValue,
  Phq9AnswerValue,
  Phq9AnswerValue,
  Phq9AnswerValue,
  Phq9AnswerValue,
  Phq9AnswerValue,
  Phq9AnswerValue,
  Phq9AnswerValue,
  Phq9AnswerValue,
]
