'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

import { getFavorites } from '@/requests/favorites'
import { FavoriteEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { ItemType, plural } from '@/types/itemTypes'

type FavoritesStore = Map<string, FavoriteEntity>

type FavoritesContextValue = {
  getStatus: (itemType: ItemType, itemId: string) => { isFavorite: boolean; favorite: FavoriteEntity | null }
  setStatus: (itemType: ItemType, itemId: string, isFavorite: boolean) => void
  loading: boolean
  refresh: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function makeKey(itemType: string, itemId: string): string {
  return `${itemType}:${itemId}`
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [store, setStore] = useState<FavoritesStore>(new Map())
  const [loading, setLoading] = useState(false)
  const sessionRef = useRef(session)
  const fetchedRef = useRef(false)
  const userEmailRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  const refresh = useCallback(async () => {
    const s = sessionRef.current
    if (!s) return
    setLoading(true)
    try {
      const pageSize = 100
      const map: FavoritesStore = new Map()
      let page = 1
      while (true) {
        const res = await getFavorites(s as CustomSession, page, pageSize)
        if (!res.data) break
        for (const fav of res.data) {
          map.set(makeKey(fav.itemType, fav.itemId), fav)
        }
        if (res.data.length < pageSize) break
        page += 1
      }
      setStore(map)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      fetchedRef.current = false
      userEmailRef.current = undefined
      setStore(new Map())
      return
    }
    if (status === 'authenticated') {
      const email = session?.user?.email ?? undefined
      if (userEmailRef.current !== undefined && userEmailRef.current !== email) {
        // Different user — clear stale favorites and allow re-fetch
        fetchedRef.current = false
        setStore(new Map())
      }
      userEmailRef.current = email
      if (!fetchedRef.current) {
        fetchedRef.current = true
        void refresh()
      }
    }
  }, [status, session?.user?.email, refresh])

  const getStatus = useCallback(
    (itemType: ItemType, itemId: string): { isFavorite: boolean; favorite: FavoriteEntity | null } => {
      // eslint-disable-next-line security/detect-object-injection
      const canonical = plural[itemType]
      const singular = canonical.replace(/s$/, '')
      const fav =
        store.get(makeKey(canonical, itemId)) ??
        store.get(makeKey(singular, itemId)) ??
        store.get(makeKey(itemType, itemId))
      return { isFavorite: !!fav, favorite: fav ?? null }
    },
    [store]
  )

  const setStatus = useCallback((itemType: ItemType, itemId: string, isFavorite: boolean) => {
    // eslint-disable-next-line security/detect-object-injection
    const canonical = plural[itemType]
    const key = makeKey(canonical, itemId)
    setStore((prev) => {
      const next = new Map(prev)
      if (isFavorite) {
        const optimistic: FavoriteEntity = {
          id: '',
          user: '',
          itemType: canonical,
          itemId,
          createdAt: new Date().toISOString(),
        }
        next.set(key, optimistic)
      } else {
        next.delete(key)
        next.delete(makeKey(canonical.replace(/s$/, ''), itemId))
        next.delete(makeKey(itemType, itemId))
      }
      return next
    })
  }, [])

  return (
    <FavoritesContext.Provider value={{ getStatus, setStatus, loading, refresh }}>{children}</FavoritesContext.Provider>
  )
}

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider')
  return ctx
}
