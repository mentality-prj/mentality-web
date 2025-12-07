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
