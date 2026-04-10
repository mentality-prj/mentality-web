import { useCallback, useEffect, useState } from 'react'

import { useFavoritesContext } from '@/context/favoritesContext'
import { ItemType } from '@/types/itemTypes'

export function useFavorite(itemType: ItemType, itemId?: string, initial = false) {
  const { getStatus, setStatus, refresh: refreshContext, loading: contextLoading } = useFavoritesContext()

  const resolved = itemId ? getStatus(itemType, itemId) : { isFavorite: false, favorite: null }
  const [isFavorite, setIsFavoriteLocal] = useState<boolean>(initial || resolved.isFavorite)
  const [favoriteEntry, setFavoriteEntry] = useState<Record<string, unknown> | null>(
    resolved.favorite as Record<string, unknown> | null
  )

  // Synchronize local state with the context when it changes
  useEffect(() => {
    if (!itemId) return
    const s = getStatus(itemType, itemId)
    setIsFavoriteLocal(s.isFavorite)
    setFavoriteEntry(s.favorite as Record<string, unknown> | null)
  }, [getStatus, itemType, itemId])

  const setIsFavorite = useCallback(
    (value: boolean) => {
      setIsFavoriteLocal(value)
      if (itemId) setStatus(itemType, itemId, value)
    },
    [itemId, itemType, setStatus]
  )

  const refresh = useCallback(async () => {
    await refreshContext()
  }, [refreshContext])

  return { isFavorite, setIsFavorite, refresh, loading: contextLoading, favorite: favoriteEntry }
}

export default useFavorite
