import { SupportedLanguage } from './languages'
import { ITEM_TYPE_DEFS } from './itemTypes'

// Affirmations
export type AffirmationEntity = {
  id: string
  translations: Record<SupportedLanguage, string>
  imageUrl: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
export type LocalAffirmation = AffirmationEntity & { isFavorite?: boolean }
export type PaginatedAffirmations = { items: AffirmationEntity[]; total: number }
export type GenerateAffirmationDto = {
  prompt?: string
}

// Tips
export type TipEntity = {
  id: string
  translations: Record<SupportedLanguage, string>
  tags?: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
export type LocalTip = TipEntity & { isFavorite?: boolean }
export type PaginatedTips = { items: TipEntity[]; total: number }

export type GenerateTipDto = {
  prompt?: string
  lang: SupportedLanguage
}

// Favorites
export type FavoriteItemType = keyof typeof ITEM_TYPE_DEFS

export type FavoriteEntity = {
  id: string
  user: string
  itemType: string
  itemId: string
  item?: Record<string, unknown> | null
  createdAt: string
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

export type ExerciseEntity = {
  id: string
  category: ExerciseCategory
  translations: {
    title: Record<SupportedLanguage, string>
    annotation: Record<SupportedLanguage, string>
    description: Record<SupportedLanguage, string>
  }
  tags: string[]
  createdAt: string
  updatedAt?: string
}

export type ExerciseEntityTranslations = ExerciseEntity['translations']

export type CreateExerciseDto = Omit<ExerciseEntity, 'id' | 'createdAt' | 'updatedAt'>

export type GeneratedExercise = ExerciseEntity

export type PaginatedExercises = { items: ExerciseEntity[]; total: number }

export type ExerciseCategory = 'meditation' | 'breathing' | 'calming'
export type LocalExercise = ExerciseEntity & { isFavorite?: boolean }

export type GenerateExerciseDto = {
  category: ExerciseCategory
  prompt?: string
}

export type UpdateExerciseDto = {
  category?: ExerciseCategory
  tags?: string[]
  translations?: {
    title?: Record<SupportedLanguage, string>
    annotation?: Record<SupportedLanguage, string>
    description?: Record<SupportedLanguage, string>
  }
  isPublished?: boolean
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

// Goals
export type GoalEntity = {
  id: string
  userId?: string
  text: string
  check: number
  repeat: number
  status?: 'pending' | 'completed' | 'in progress'
  createdAt?: string
  updatedAt?: string
}

export type CreateGoalDto = {
  userId?: string
  text: string
  repeat?: number
}

export type UpdateGoalDto = {
  text?: string
  check?: number
  repeat?: number
  status?: 'pending' | 'completed' | 'in progress'
}

// Mood records
export type CreateMoodRecordDto = {
  mood: string
  note?: string
  tags?: string[]
  stressLevel?: number
  active?: boolean
}

export type MoodRecordEntity = {
  id: string
  userId?: string
  mood: string
  note?: string
  tags?: string[]
  stressLevel?: number
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

export type SetActiveDto = { active: boolean }

export type UpdateMoodRecordDto = {
  mood?: string
  note?: string
  tags?: string[]
  stressLevel?: number
  active?: boolean
}

// Diary
export type CreateDiaryDto = {
  content: string
  tags?: string[]
}

export type DiaryEntity = {
  id: string
  userId?: string
  content: string
  tags?: string[]
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

export type UpdateDiaryDto = {
  content?: string
  tags?: string[]
  active?: boolean
}
