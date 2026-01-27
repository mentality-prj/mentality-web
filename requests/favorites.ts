import { PAGE_SIZE } from '@/constants/pagination'
import { logger } from '@/lib/logger'
import { mapAffirmation } from '@/mappers/affirmationMapper'
import { mapExercise } from '@/mappers/exerciseMapper'
import { mapTip } from '@/mappers/tipMapper'
import { FavoriteEntity, FavoriteItemType } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { ItemType, plural } from '@/types/itemTypes'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export type ToggleResult = { data?: { isFavorite: boolean } } | { error: unknown }

export type GetFavoriteResult =
  | { data?: { isFavorite: boolean; favorite?: FavoriteEntity | null } }
  | { error: unknown }

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
  const url = `${APIUrl}/favorites?page=1&limit=${PAGE_SIZE}&includeItem=true`
  const res = await performAuthRequest<unknown>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get favorites list', { error: res.error, url, itemType, itemId })
    return { error: res.error }
  }

  const payload = res.data as unknown

  const payloadObj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : undefined

  let list: FavoriteEntity[] = []
  if (Array.isArray(payload)) {
    list = payload as FavoriteEntity[]
  } else if (payloadObj) {
    const itemsField = payloadObj['items']
    const dataField = payloadObj['data']
    if (Array.isArray(itemsField)) list = itemsField as FavoriteEntity[]
    else if (Array.isArray(dataField)) list = dataField as FavoriteEntity[]
  }

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

/**
 * Get list of favorites (client-side helper).
 * Accepts optional pagination and includeItem flag to request full item objects.
 */
export async function getFavorites(
  session: CustomSession | null,
  page = 1,
  limit = 10,
  includeItem = false,
  apiBaseUrl?: string
): Promise<{ data?: FavoriteEntity[]; error?: string; headers?: Headers }> {
  const base = apiBaseUrl || APIUrl
  const url = `${base}/favorites?page=${page}&limit=${limit}&includeItem=${includeItem ? 'true' : 'false'}`

  const res = await performAuthRequest<unknown>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to fetch favorites', { url, error: res.error })
    return { error: typeof res.error === 'string' ? res.error : String(res.error) }
  }

  const payload = res.data
  let list: FavoriteEntity[] = []
  if (Array.isArray(payload)) {
    list = payload as FavoriteEntity[]
  } else if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    const itemsField = obj['items']
    const dataField = obj['data']
    if (Array.isArray(itemsField)) list = itemsField as FavoriteEntity[]
    else if (Array.isArray(dataField)) list = dataField as FavoriteEntity[]
  }

  if (includeItem && Array.isArray(list)) {
    const normalized = list.map((f) => {
      try {
        const itype = (f.itemType || '').toString().replace(/s$/, '')
        if (!f.item) return f

        if (itype === 'exercise') {
          const mapped = mapExercise(f.item)
          if (mapped) f.item = mapped as Record<string, unknown>
        } else if (itype === 'affirmation') {
          const mapped = mapAffirmation(f.item)
          if (mapped) f.item = mapped as Record<string, unknown>
        } else if (itype === 'tip') {
          const mapped = mapTip(f.item)
          if (mapped) f.item = mapped as Record<string, unknown>
        }
      } catch (e) {
        logger.error('Failed to map favorite item', { id: f.id, error: e })
      }
      return f
    })
    return { data: normalized, headers: res.headers }
  }

  return { data: list, headers: res.headers }
}

export default toggleFavoriteWithSession
