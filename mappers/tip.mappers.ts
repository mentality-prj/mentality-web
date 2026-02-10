import { TipEntity } from '@/types/api-responses'
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

export function mapTip(input: unknown): TipEntity | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>

  const id = safeString(obj.id ?? obj._id ?? '')
  if (!id) return null

  const translationsRaw = obj.translations ?? {}
  const translations: TipEntity['translations'] = {} as any

  for (const lang of supportedLanguages) {
    const v = (translationsRaw as Record<string, unknown>)[lang as SupportedLanguage] ?? ''
    translations[lang as SupportedLanguage] = safeString(v)
  }

  const tagsRaw = obj.tags
  let tags: string[] = []
  if (Array.isArray(tagsRaw)) tags = tagsRaw.map((x) => safeString(x)).filter(Boolean)
  else if (typeof tagsRaw === 'string')
    tags = tagsRaw
      .split(',')
      .map((s) => s.trim())
      .map(safeString)
      .filter(Boolean)

  const isPublished = typeof obj.isPublished === 'boolean' ? obj.isPublished : true
  const createdAt = safeString(obj.createdAt ?? '')
  const updatedAt = obj.updatedAt ? safeString(obj.updatedAt) : ''

  return {
    id,
    translations,
    tags,
    isPublished,
    createdAt,
    updatedAt,
  }
}

export function mapTips(input: unknown): TipEntity[] {
  if (!input) return []
  if (Array.isArray(input)) return input.map(mapTip).filter((x): x is TipEntity => x !== null)
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (Array.isArray(obj.data)) return mapTips(obj.data)
    if (Array.isArray(obj.items)) return mapTips(obj.items)
  }
  return []
}
