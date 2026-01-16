import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { ItemType, plural } from '@/types/itemTypes'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export type ToggleResult = { data?: { isFavorite: boolean } } | { error: unknown }

export type FavoriteEntry = {
  id: string
  user: string
  itemType: string
  itemId: string
  item?: Record<string, unknown> | null
  createdAt?: string
}

export type GetFavoriteResult = { data?: { isFavorite: boolean; favorite?: FavoriteEntry | null } } | { error: unknown }

/**
 * Toggle favorite using authenticated session helpers (recommended).
 */
export async function toggleFavoriteWithSession(
  session: CustomSession | null,
  itemType: ItemType,
  itemId: string,
  isFavorite: boolean
): Promise<ToggleResult> {
  const url = `${APIUrl}/${plural[itemType as ItemType]}/${itemId}/favorite`
  const res = await performAuthRequest<{ isFavorite: boolean }>(session, url, {
    method: 'PATCH',
    body: { isFavorite },
  })

  if ('error' in res) {
    logger.error('Failed to toggle favorite (session)', { error: res.error, url, itemType, itemId })
    return { error: res.error }
  }

  return { data: res.data }
}

/**
 * Toggle favorite using raw token and fetch. Kept for backwards compatibility.
 */
export async function toggleFavoriteWithToken(
  authToken: string,
  apiBaseUrl: string,
  itemType: ItemType,
  itemId: string,
  isFavorite: boolean
): Promise<ToggleResult> {
  const url = `${apiBaseUrl || APIUrl}/${plural[itemType as ItemType]}/${itemId}/favorite`

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ isFavorite }),
    })

    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`
      try {
        const body = await res.json()
        errMsg = body?.message || errMsg
      } catch (_e) {
        /* ignore */
      }
      logger.error('Failed to toggle favorite (token)', { url, status: res.status, itemType, itemId })
      return { error: errMsg }
    }

    const data = await res.json()
    return { data }
  } catch (err) {
    logger.error('Network error toggling favorite', { url, err })
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Get favorite status for a specific item
 */
export async function getFavoriteStatus(
  session: CustomSession | null,
  itemType: ItemType,
  itemId: string
): Promise<GetFavoriteResult> {
  // Backend provides a paginated list at GET /api/favorites — there is no GET /:type/:id/favorite
  const url = `${APIUrl}/favorites?page=1&limit=1000`
  const res = await performAuthRequest<unknown>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get favorites list', { error: res.error, url, itemType, itemId })
    return { error: res.error }
  }

  const payload = res.data as unknown

  const payloadObj = payload as Record<string, unknown> | undefined

  const list: FavoriteEntry[] = Array.isArray(payload)
    ? (payload as FavoriteEntry[])
    : Array.isArray(payloadObj?.items)
      ? (payloadObj.items as FavoriteEntry[])
      : Array.isArray(payloadObj?.data)
        ? (payloadObj.data as FavoriteEntry[])
        : []

  const typePlural = plural[itemType as ItemType]
  const typeSingular = typeof typePlural === 'string' ? typePlural.replace(/s$/, '') : typePlural

  const found = list.find(
    (f) =>
      f &&
      (f.itemType === typePlural || f.itemType === typeSingular || f.itemType === itemType) &&
      (f.itemId === itemId || f.item?._id === itemId || String(f.itemId) === String(itemId))
  )

  logger.info('Favorites list parsed', {
    url,
    listLength: Array.isArray(list) ? list.length : 0,
    searched: { itemType, itemId },
    foundId: found?.id ?? null,
    foundItemId: found?.itemId ?? found?.item?._id ?? null,
  })

  return { data: { isFavorite: !!found, favorite: found } }
}

export default toggleFavoriteWithSession
