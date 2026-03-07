export interface AttentionSprintProps {
  symbols?: string[]
  targetSymbol?: string
  gridSize?: number
  gameDuration?: number
}

export interface DifficultyConfig {
  symbols: string[]
  changeTarget: boolean
}

export type DifficultyLevel = 0 | 1 | 2 | 3

export interface DifficultyLevelKey {
  level: DifficultyLevel
  key: 'level0' | 'level1' | 'level2' | 'level3'
}

export interface AttentionSprintResultPayload {
  score: number
  errors: number
  difficulty: number
  duration: number
  accuracy: number
  reactionTimeAvg: number
  reactionTimeStd: number
  generatedSequence: string[]
  language: string
}
