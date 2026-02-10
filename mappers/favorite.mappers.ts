import { AffirmationWithType } from '@/components/AffirmationsAndTips/FilteredHistory'
import { logger } from '@/lib/logger'
import { mapAffirmation } from '@/mappers/affirmation.mappers'
import { mapExercise } from '@/mappers/exercise.mappers'
import { mapTip } from '@/mappers/tip.mappers'
import { FavoriteEntity } from '@/types/api-responses'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'

function safeString(v: unknown) {
  if (typeof v === 'string') return v
  if (v == null) return ''
  return String(v)
}

export function mapFavoriteToLocal(fav: FavoriteEntity): AffirmationWithType {
  const item = (fav.item as Record<string, unknown>) ?? {}
  const id = fav.itemId ?? (item['id'] as string | undefined) ?? (item['_id'] as string | undefined) ?? fav.id
  const typeRaw = String(fav.itemType ?? item['type'] ?? '')
  const type = typeRaw.replace(/s$/, '') || ''

  let translations: Record<SupportedLanguage, string> = (item.translations as
    | Record<SupportedLanguage, string>
    | undefined) ?? {
    en: safeString(item['en']),
    uk: safeString(item['uk']),
    pl: safeString(item['pl']),
  }

  try {
    if (type === 'exercise') {
      const mapped = mapExercise(item)
      if (mapped) {
        // Combine exercise translations (title, annotation, description) into a single string per locale
        const t: Record<SupportedLanguage, string> = {
          en: '',
          uk: '',
          pl: '',
        }
        const titleMap = mapped.translations.title || ({} as Record<SupportedLanguage, string>)
        const annotationMap = mapped.translations.annotation || ({} as Record<SupportedLanguage, string>)
        const descriptionMap = mapped.translations.description || ({} as Record<SupportedLanguage, string>)
        for (const k of supportedLanguages) {
          const title = safeString(titleMap[k as SupportedLanguage])
          const annotation = safeString(annotationMap[k as SupportedLanguage])
          const description = safeString(descriptionMap[k as SupportedLanguage])
          const parts = [title, annotation, description].filter(Boolean)
          t[k as SupportedLanguage] = parts.join('\n\n')
        }
        translations = t
      }
    } else if (type === 'affirmation') {
      const mapped = mapAffirmation(item)
      if (mapped) translations = mapped.translations
    } else if (type === 'tip') {
      const mapped = mapTip(item)
      if (mapped) translations = mapped.translations
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error('mapFavoriteToLocal: failed to build translations', e)
    } else {
      logger.error('mapFavoriteToLocal: failed to build translations', { error: String(e) })
    }
  }

  const createdAt = (item['createdAt'] as string | undefined) ?? fav.createdAt ?? new Date().toISOString()

  return {
    id: String(id),
    isPublished: typeof item['isPublished'] === 'boolean' ? (item['isPublished'] as boolean) : true,
    translations,
    createdAt: safeString(createdAt),
    type,
  }
}

export default mapFavoriteToLocal
