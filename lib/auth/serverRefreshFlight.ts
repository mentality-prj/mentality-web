/**
 * Best-effort per-instance deduplication of refresh-token rotations.
 *
 * This covers overlapping SSR/proxy requests routed to the same Next.js
 * instance. Cross-instance/serverless concurrency still requires a shared
 * atomic session store; browser tabs also coordinate using the Web Locks API.
 * No raw bearer/refresh token is used as a cache key.
 */
const CACHE_SUCCESS_MS = 2_000
const MAX_PENDING_MS = 12_000
const MAX_ENTRIES = 128

type Flight<T> = {
  promise: Promise<T>
  pending: boolean
  expiresAt: number
}

const flights = new Map<string, Flight<unknown>>()

async function fingerprint(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function pruneSettled(now: number): void {
  for (const [key, entry] of flights) {
    if (!entry.pending && entry.expiresAt <= now) flights.delete(key)
  }
}

function freeSettledCapacity(): void {
  for (const [key, entry] of flights) {
    if (flights.size < MAX_ENTRIES) break
    // Never evict in-flight rotations; a second call with the same old cookie
    // must continue to share the first provider exchange.
    if (!entry.pending) flights.delete(key)
  }
}

export async function coalesceRefreshExchange<T>(refreshToken: string, perform: () => Promise<T>): Promise<T> {
  const key = await fingerprint(refreshToken)
  const now = Date.now()
  const existing = flights.get(key) as Flight<T> | undefined
  if (existing && (existing.pending || existing.expiresAt > now)) return existing.promise

  pruneSettled(now)
  freeSettledCapacity()
  if (flights.size >= MAX_ENTRIES) {
    // Saturation must not evict an unrelated pending rotation. New keys use
    // the provider directly; existing pending keys remain deduplicated.
    return perform()
  }

  const entry: Flight<T> = {
    promise: Promise.resolve().then(perform),
    pending: true,
    expiresAt: now + MAX_PENDING_MS,
  }
  flights.set(key, entry as Flight<unknown>)
  try {
    const result = await entry.promise
    if (flights.get(key) === entry) {
      entry.pending = false
      entry.expiresAt = Date.now() + CACHE_SUCCESS_MS
    }
    return result
  } catch (error) {
    if (flights.get(key) === entry) flights.delete(key)
    throw error
  }
}
