import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { logger } from '@/lib/logger'
import { toggleFavoriteWithSession } from '@/requests/favorites'
import { CustomSession } from '@/types/auth'
import { ItemType } from '@/types/itemTypes'
import { Button } from '@/ui/button'

interface Props {
  itemType: ItemType
  itemId: string
  isFavorite: boolean
  onChange?: (isFavorite: boolean) => void
  className?: string
}

export const FavoriteButton = ({ itemType, itemId, isFavorite, onChange, className }: Props) => {
  const { session } = useAuth()
  const t = useTranslations('components.FavoriteButton')

  const toggle = async () => {
    try {
      // Use session-based helper; get session via `useSession()` from next-auth
      if (!session) {
        logger.error('No session provided; cannot toggle favorite')
        return
      }

      const result = await toggleFavoriteWithSession(session as CustomSession, itemType, itemId, !isFavorite)

      if ('data' in result && result.data) {
        const next = !!result.data.isFavorite
        onChange?.(next)
      } else {
        logger.error('Toggle favorite failed', { error: (result as { error?: unknown }).error })
      }
    } catch (err) {
      logger.error('Failed to toggle favorite', err instanceof Error ? err : { error: err })
    }
  }

  return (
    <Button
      type="button"
      variant="iconTool"
      aria-pressed={isFavorite}
      onClick={toggle}
      title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      className={className}
    >
      {isFavorite ? <Heart size={16} fill="currentColor" /> : <Heart size={16} />}
    </Button>
  )
}

export default FavoriteButton
