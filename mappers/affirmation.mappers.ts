import { AffirmationEntity } from '@/types/api-responses'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'

function safeString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  try {
    return String(value)
  } catch {
    return ''
  }
}

export function mapAffirmation(input: unknown): AffirmationEntity | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>

  const id = safeString(obj.id ?? obj._id ?? '')
  if (!id) return null

  const translationsRaw = obj.translations ?? {}
  const translations: AffirmationEntity['translations'] = {} as any

  for (const lang of supportedLanguages) {
    const v = (translationsRaw as Record<string, unknown>)[lang as SupportedLanguage] ?? ''
    translations[lang as SupportedLanguage] = safeString(v)
  }

  const imageUrl = safeString(obj.imageUrl ?? obj.image ?? '')
  const isPublished = typeof obj.isPublished === 'boolean' ? obj.isPublished : true
  const createdAt = safeString(obj.createdAt ?? '')
  const updatedAt = obj.updatedAt ? safeString(obj.updatedAt) : ''

  return {
    id,
    translations,
    imageUrl,
    isPublished,
    createdAt,
    updatedAt,
  }
}

export function mapAffirmations(input: unknown): AffirmationEntity[] {
  if (!input) return []
  if (Array.isArray(input)) return input.map(mapAffirmation).filter((x): x is AffirmationEntity => x !== null)
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (Array.isArray(obj.data)) return mapAffirmations(obj.data)
    if (Array.isArray(obj.items)) return mapAffirmations(obj.items)
  }
  return []
}
