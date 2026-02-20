import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { toggleFavoriteWithSession } from '@/requests/favorites'
import { CustomSession } from '@/types/auth'
import { ItemType } from '@/types/itemTypes'

interface Props {
  itemType: ItemType
  itemId: string
  isFavorite: boolean
  className?: string
  onChange?: (isFavorite: boolean) => void
}

export const FavoriteButton = ({ itemType, itemId, isFavorite, className = '', onChange }: Props) => {
  const { data: session } = useSession()
  const t = useTranslations('components.FavoriteButton')

  const toggle = async () => {
    try {
      // Use session-based helper; get session via `useSession()` from next-auth
      if (!session) {
        console.error('No session provided; cannot toggle favorite')
        return
      }

      const result = await toggleFavoriteWithSession(session as CustomSession, itemType, itemId, !isFavorite)

      if ('data' in result && result.data) {
        const next = !!result.data.isFavorite
        onChange?.(next)
      } else {
        console.error('Toggle favorite failed', (result as { error?: unknown }).error)
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err)
    }
  }

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      onClick={toggle}
      className={className}
      title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        borderRadius: 6,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      {isFavorite ? <Heart size={16} fill="currentColor" /> : <Heart size={16} />}
    </button>
  )
}

export default FavoriteButton
