import { GoalCategory, GoalStatus } from './goals'
import { ITEM_TYPE_DEFS } from './itemTypes'
import { SupportedLanguage } from './languages'

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

export type LocalFavorite = Omit<FavoriteEntity, 'item'> & {
  item?: AffirmationEntity | TipEntity | ExerciseEntity | null
}

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
  text: string
  check: number
  repeat: number
  status: GoalStatus
  deadline?: string
  createdAt?: string
  updatedAt?: string
  category: GoalCategory
}

// Mood records
export type CreateMoodRecordDto = {
  moodLevel: number
  stressLevel: number
  energyLevel: number
  focusLevel: number
  tags?: string[]
}

export type MoodRecordEntity = {
  id: string
  moodLevel?: number
  stressLevel: number
  energyLevel: number
  focusLevel: number
  tags?: string[]
  createdAt?: string
}

export type SetActiveDto = {
  active: boolean
}

// Diary
export type CreateDiaryDto = {
  content: string
  tags?: string[]
  isActive: boolean
}

export type DiaryEntity = {
  id: string
  content: string
  tags?: string[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// Mood Story
export type MoodStoryLocalizedString = Record<SupportedLanguage, string>

export type MoodStoryActionType = 'exercise' | 'sleep' | 'checkin'

export type MoodStoryAction = {
  type: MoodStoryActionType
  category?: string
  label: string
}

export type MoodStoryScreenEntity = {
  title: MoodStoryLocalizedString
  text: MoodStoryLocalizedString
  action?: MoodStoryAction
}

export type MoodStoryEntity = {
  screens: MoodStoryScreenEntity[]
  recommendedAffirmationId?: string
  recommendedTipId?: string
  recommendedExerciseId?: string
}
