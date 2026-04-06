import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { getFavoriteStatus } from '@/requests/favorites'
import { CustomSession } from '@/types/auth'
import { ItemType } from '@/types/itemTypes'

export function useFavorite(itemType: ItemType, itemId?: string, initial = false) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState<boolean>(initial)
  const [favoriteEntry, setFavoriteEntry] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!itemId) return
    if (!session) return
    setLoading(true)
    try {
      const res = await getFavoriteStatus(session as CustomSession, itemType, itemId)
      if ('data' in res && res.data) {
        setIsFavorite(!!res.data.isFavorite)
        setFavoriteEntry(res.data.favorite ?? null)
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [session, itemId, itemType])

  useEffect(() => {
    setIsFavorite(initial)
  }, [initial])

  useEffect(() => {
    // refresh when itemId or session becomes available
    if (initial) return
    if (!itemId) return
    if (!session) return
    void refresh()
  }, [itemId, session, refresh, initial])

  return { isFavorite, setIsFavorite, refresh, loading, favorite: favoriteEntry }
}

export default useFavorite
