import { AffirmationWithType } from '@/components/AffirmationsAndTips/FilteredHistory'
import { mapAffirmation } from '@/mappers/affirmationMapper'
import { mapExercise } from '@/mappers/exerciseMapper'
import { mapTip } from '@/mappers/tipMapper'
import { FavoriteEntity } from '@/types/api-responses'

function safeString(v: unknown) {
  if (typeof v === 'string') return v
  if (v == null) return ''
  return String(v)
}

export function mapFavoriteToLocal(fav: FavoriteEntity): AffirmationWithType {
  const item = fav.item || {}
  const id = fav.itemId ?? item.id ?? item._id ?? fav.id
  const typeRaw = (fav.itemType || item.type || '').toString()
  const type = typeRaw.replace(/s$/, '') || ''

  let translations: Record<string, string> = (item.translations as Record<string, string> | undefined) ?? {
    en: item.en || '',
    uk: item.uk || '',
    pl: item.pl || '',
  }

  try {
    if (type === 'exercise') {
      const mapped = mapExercise(item)
      if (mapped) {
        // Combine exercise translations (title, annotation, description) into a single string per locale
        const t: Record<string, string> = {}
        const titleMap = mapped.translations.title || {}
        const annotationMap = mapped.translations.annotation || {}
        const descriptionMap = mapped.translations.description || {}
        for (const k of Object.keys(titleMap)) {
          const title = safeString(titleMap[k])
          const annotation = safeString(annotationMap[k])
          const description = safeString(descriptionMap[k])
          const parts = [title, annotation, description].filter(Boolean)
          t[k] = parts.join('\n\n')
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
    // swallow; keep best-effort translations
  }

  const createdAt = item.createdAt ?? fav.createdAt ?? new Date().toISOString()

  return {
    id: String(id),
    isPublished: typeof item.isPublished === 'boolean' ? item.isPublished : true,
    translations,
    createdAt: safeString(createdAt),
    type,
  }
}

export default mapFavoriteToLocal
