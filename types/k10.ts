export type K10AnswerValue = 1 | 2 | 3 | 4 | 5

export type K10Level = 'green' | 'yellow' | 'orange' | 'red'

export interface K10SubmitPayload {
  answers: K10AnswerValue[]
}

export interface K10ApiResponse {
  score: number
  level: K10Level
  message: string
  submittedAt: string
}

export interface K10HistoryEntry {
  date: string
  score: number
}

export type K10Answers = [
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
  K10AnswerValue,
]
