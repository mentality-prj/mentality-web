export type Gad7AnswerValue = 0 | 1 | 2 | 3

export type Gad7Level = 'minimal' | 'mild' | 'moderate' | 'severe'

export interface Gad7SubmitPayload {
  answers: Gad7AnswerValue[]
}

export interface Gad7ApiResponse {
  score: number
  level: Gad7Level
  label: string
  recommendation: string
  submittedAt: string
}

export type Gad7Session = {
  answers: (Gad7AnswerValue | null)[]
}

export interface Gad7HistoryEntry {
  date: string
  score: number
}
