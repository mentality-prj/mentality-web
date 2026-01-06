import { SupportedLanguage } from './languages'

// Tips
export type TipEntity = {
  id: string
  translations: Record<SupportedLanguage, string>
  tags?: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type GenerateTipDto = {
  prompt?: string
  lang: SupportedLanguage
}

// Tags
export type TagEntity = {
  id: string
  key: string
  translations: Record<SupportedLanguage, string>
  createdAt: string
  updatedAt: string
}

export type CreateTagDto = {
  key: string
  translations: Record<SupportedLanguage, string>
}

// Exercises
export type ExerciseEntity = {
  id: string
  category: string
  title: string
  annotation: string
  description: string
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

export type CreateExerciseDto = {
  category: string
  title: string
  annotation: string
  description: string
  tags: string[]
}

//Goals
export type GoalEntity = {
  id: string
  userId: string
  text: string
  repeat: number
  check: number
  status: 'pending' | 'completed' | 'in progress'
}

export type CreateGoalDto = {
  text: string
  repeat: number
}

export type UpdateGoalDto = {
  check: number
}

// Auth
export type ValidateUserDto = {
  token: string
  email: string
  name?: string
  image?: string
  provider: string
}

export type UserEntity = {
  id: string
  email: string
  name?: string
  image?: string
  role: string
  isAIAuthorized: boolean
  createdAt: string
  updatedAt: string
}
