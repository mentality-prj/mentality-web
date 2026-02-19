import { CreateExerciseDto, ExerciseCategory, ExerciseEntityTranslations } from '@/types/api-responses'
import type { SupportedLanguage } from '@/types/languages'

export function buildCreatePayload(opts: {
  category: ExerciseCategory
  translations: ExerciseEntityTranslations
  localeKey?: SupportedLanguage
  tags?: string[]
}): CreateExerciseDto {
  const { category, translations, tags } = opts
  return {
    category,
    translations,
    tags: tags || [],
  }
}

export function buildUpdatePayload(opts: {
  category: ExerciseCategory
  translations: ExerciseEntityTranslations
  tags?: string[]
}): CreateExerciseDto {
  const { category, translations, tags } = opts
  return {
    category,
    translations,
    tags: tags || [],
  }
}

const exerciseMappers = { buildCreatePayload, buildUpdatePayload }
export default exerciseMappers
