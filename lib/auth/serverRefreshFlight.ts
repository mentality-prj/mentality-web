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
  expiresAt: number
}

const flights = new Map<string, Flight<unknown>>()

async function fingerprint(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function prune(now: number): void {
  for (const [key, entry] of flights) {
    if (entry.expiresAt <= now) flights.delete(key)
  }
  while (flights.size >= MAX_ENTRIES) {
    const oldest = flights.keys().next().value
    if (!oldest) break
    flights.delete(oldest)
  }
}

export async function coalesceRefreshExchange<T>(refreshToken: string, perform: () => Promise<T>): Promise<T> {
  const key = await fingerprint(refreshToken)
  const now = Date.now()
  prune(now)
  const existing = flights.get(key) as Flight<T> | undefined
  if (existing && existing.expiresAt > now) return existing.promise

  const entry: Flight<T> = {
    // Call perform on the microtask queue so the entry is installed before
    // another request can observe the same refresh token.
    promise: Promise.resolve().then(perform),
    expiresAt: now + MAX_PENDING_MS,
  }
  flights.set(key, entry as Flight<unknown>)
  try {
    const result = await entry.promise
    // Keep a tiny success window so late identical-cookie requests reuse the
    // same rotated tokens rather than replaying a consumed refresh token.
    if (flights.get(key) === entry) entry.expiresAt = Date.now() + CACHE_SUCCESS_MS
    return result
  } catch (error) {
    if (flights.get(key) === entry) flights.delete(key)
    throw error
  }
}
