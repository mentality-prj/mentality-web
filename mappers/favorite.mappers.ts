import { logger } from '@/lib/logger'
import { mapAffirmation } from '@/mappers/affirmation.mappers'
import { mapExercise } from '@/mappers/exercise.mappers'
import { mapTip } from '@/mappers/tip.mappers'
import { AffirmationEntity, ExerciseEntity, FavoriteEntity, LocalFavorite, TipEntity } from '@/types/api-responses'

/**
 * Maps a FavoriteEntity from API to LocalFavorite with properly typed item.
 * Ensures the item field contains the actual entity (AffirmationEntity | TipEntity | ExerciseEntity).
 */
export function mapFavoriteToLocal(fav: FavoriteEntity): LocalFavorite {
  const itemData = (fav.item as Record<string, unknown>) ?? {}
  const typeRaw = String(fav.itemType ?? '')
  const typeSingular = typeRaw.replace(/s$/, '')

  let typedItem: AffirmationEntity | TipEntity | ExerciseEntity

  try {
    if (typeSingular === 'exercise') {
      const mapped = mapExercise(itemData)
      if (!mapped) {
        logger.error('mapFavoriteToLocal: failed to map exercise')
        throw new Error('Failed to map exercise')
      }
      typedItem = mapped
    } else if (typeSingular === 'affirmation') {
      const mapped = mapAffirmation(itemData)
      if (!mapped) {
        logger.error('mapFavoriteToLocal: failed to map affirmation')
        throw new Error('Failed to map affirmation')
      }
      typedItem = mapped
    } else if (typeSingular === 'tip') {
      const mapped = mapTip(itemData)
      if (!mapped) {
        logger.error('mapFavoriteToLocal: failed to map tip')
        throw new Error('Failed to map tip')
      }
      typedItem = mapped
    } else {
      logger.error('mapFavoriteToLocal: unknown item type', { type: typeSingular })
      throw new Error(`Unknown item type: ${typeSingular}`)
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error('mapFavoriteToLocal: failed to map item', e)
    } else {
      logger.error('mapFavoriteToLocal: failed to map item', { error: String(e) })
    }
    // Fallback: return raw data as affirmation
    typedItem = itemData as AffirmationEntity
  }

  return {
    ...fav,
    item: typedItem,
  }
}

export default mapFavoriteToLocal
