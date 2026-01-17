import { ExerciseCategory, ExerciseEntity } from '@/types/api-responses'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'

function isValidCategory(cat: unknown): cat is ExerciseCategory {
  return cat === 'meditation' || cat === 'breathing' || cat === 'calming'
}

function safeString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  try {
    return String(value)
  } catch {
    return ''
  }
}

export function mapExercise(input: unknown): ExerciseEntity | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>

  const id = safeString(obj.id ?? obj._id ?? '')
  if (!id) return null

  const categoryRaw = obj.category
  const category: ExerciseCategory = isValidCategory(categoryRaw) ? categoryRaw : 'meditation'

  const translationsRaw = obj.translations ?? {}
  const translations = {
    title: {} as Record<SupportedLanguage, string>,
    annotation: {} as Record<SupportedLanguage, string>,
    description: {} as Record<SupportedLanguage, string>,
  }

  for (const lang of supportedLanguages) {
    const t = (translationsRaw as Record<string, unknown>)[lang as SupportedLanguage] ?? {}
    translations.title[lang as SupportedLanguage] = safeString((t as Record<string, unknown>).title ?? '')
    translations.annotation[lang as SupportedLanguage] = safeString((t as Record<string, unknown>).annotation ?? '')
    translations.description[lang as SupportedLanguage] = safeString((t as Record<string, unknown>).description ?? '')
  }

  const tagsRaw = obj.tags
  const tags = Array.isArray(tagsRaw) ? tagsRaw.map((x) => safeString(x)).filter(Boolean) : []

  const createdAt = safeString(obj.createdAt ?? new Date().toISOString())
  const updatedAt = obj.updatedAt ? safeString(obj.updatedAt) : undefined

  return {
    id,
    category,
    translations,
    tags,
    createdAt,
    updatedAt,
  }
}

export function mapExercises(input: unknown): ExerciseEntity[] {
  if (!input) return []
  if (Array.isArray(input)) {
    return input.map(mapExercise).filter((e): e is ExerciseEntity => e !== null)
  }

  // handle wrapped responses { data: [...] } or { items: [...] }
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (Array.isArray(obj.data)) return mapExercises(obj.data)
    if (Array.isArray(obj.items)) return mapExercises(obj.items)
  }

  return []
}
