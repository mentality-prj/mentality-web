/**
 * Extracts pagination total from HTTP response headers.
 * Handles both `X-Total-Count` (standard) and `x-total-count` (lowercase) header variants.
 * Falls back to the length of the current page when the header is absent or unparseable.
 */
export function extractPaginationTotal(headers: Headers | undefined, fallback: number): number {
  const raw = headers?.get('X-Total-Count') ?? headers?.get('x-total-count')
  if (!raw) return fallback
  const parsed = parseInt(raw, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}
