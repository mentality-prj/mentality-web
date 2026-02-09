import { getUserTags } from '@/requests/userTags'
import type { CustomSession } from '@/types/auth'
import type { UserTag } from '@/types/tags'

type CacheEntry = {
  tags: UserTag[]
  ts: number // last access/set timestamp (ms)
}

// Cache configuration
const MAX_CACHE_ENTRIES = 200
const ENTRY_TTL_MS = 1000 * 60 * 60 // 1 hour

const cache = new Map<string, CacheEntry>()

export async function fetchUserTagsCached(session: CustomSession | null) {
  const key = session?.user?.email || null

  // If we don't have a stable per-user identifier, avoid using a shared
  // 'anonymous' cache key (which would mix data between users). Instead
  // fetch and return results without caching.
  if (!key) {
    try {
      const res = await getUserTags(session)
      if (!('error' in res) && Array.isArray(res.data)) {
        const tags = (res.data as Array<Partial<UserTag>>)
          .filter((t) => !!t?.key)
          .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))
        return { data: tags }
      }
      return res
    } catch (err) {
      return { error: err }
    }
  }

  const existing = cache.get(key)
  if (existing) {
    const age = Date.now() - existing.ts
    if (age < ENTRY_TTL_MS) {
      // Refresh recency: remove and re-insert to mark as most-recently-used
      cache.delete(key)
      const refreshed: CacheEntry = { tags: existing.tags, ts: Date.now() }
      cache.set(key, refreshed)
      return { data: existing.tags }
    }
    // Expired entry - remove and continue to fetch fresh data
    cache.delete(key)
  }

  try {
    const res = await getUserTags(session)
    if (!('error' in res) && Array.isArray(res.data)) {
      const tags = (res.data as Array<Partial<UserTag>>)
        .filter((t) => !!t?.key)
        .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))

      // Evict oldest entries if over capacity (simple LRU using insertion order)
      while (cache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = cache.keys().next().value
        if (!oldestKey) break
        cache.delete(oldestKey)
      }

      cache.set(key, { tags, ts: Date.now() })
      return { data: tags }
    }
    return res
  } catch (err) {
    return { error: err }
  }
}

export function clearUserTagsCacheFor(email?: string) {
  if (!email) return
  cache.delete(email)
}
