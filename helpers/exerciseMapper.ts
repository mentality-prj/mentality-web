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

  // Support two possible shapes from backend:
  // 1) translations: { en: { title, annotation, description }, uk: { ... } }
  // 2) translations: { title: { en: '...' }, annotation: { en: '...' }, description: { en: '...' } }
  const perField =
    translationsRaw && typeof translationsRaw === 'object' && 'title' in (translationsRaw as Record<string, unknown>)

  for (const lang of supportedLanguages) {
    if (perField) {
      const titleMap = (translationsRaw as Record<string, unknown>).title as Record<string, unknown> | undefined
      const annotationMap = (translationsRaw as Record<string, unknown>).annotation as
        | Record<string, unknown>
        | undefined
      const descriptionMap = (translationsRaw as Record<string, unknown>).description as
        | Record<string, unknown>
        | undefined

      translations.title[lang as SupportedLanguage] = safeString(titleMap ? titleMap[lang as SupportedLanguage] : '')
      translations.annotation[lang as SupportedLanguage] = safeString(
        annotationMap ? annotationMap[lang as SupportedLanguage] : ''
      )
      translations.description[lang as SupportedLanguage] = safeString(
        descriptionMap ? descriptionMap[lang as SupportedLanguage] : ''
      )
    } else {
      const perLang = (translationsRaw as Record<string, unknown>)[lang as SupportedLanguage] ?? {}
      translations.title[lang as SupportedLanguage] = safeString((perLang as Record<string, unknown>).title ?? '')
      translations.annotation[lang as SupportedLanguage] = safeString(
        (perLang as Record<string, unknown>).annotation ?? ''
      )
      translations.description[lang as SupportedLanguage] = safeString(
        (perLang as Record<string, unknown>).description ?? ''
      )
    }
  }

  const tagsRaw = obj.tags
  let tags: string[] = []
  if (Array.isArray(tagsRaw)) {
    tags = tagsRaw.map((x) => safeString(x)).filter(Boolean)
  } else if (typeof tagsRaw === 'string') {
    tags = tagsRaw
      .split(',')
      .map((s) => s.trim())
      .map(safeString)
      .filter(Boolean)
  }

  let createdAt: string
  if (obj.createdAt == null) {
    // Avoid fabricating a creation timestamp; log a warning and leave empty string
    // so UI can detect missing value instead of silently using current time.
    // This helps surface data quality issues from the backend.
    // eslint-disable-next-line no-console
    console.warn('mapExercise: missing createdAt for exercise', id)
    createdAt = ''
  } else {
    createdAt = safeString(obj.createdAt)
  }

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
