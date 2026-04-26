import { extractPaginationTotal } from '@/lib/http'

export function extractInviteArray(payload: unknown): unknown {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  const obj = payload as Record<string, unknown>
  if (Array.isArray(obj.items)) return obj.items
  if (Array.isArray(obj.data)) return obj.data
  if (Array.isArray(obj.invites)) return obj.invites
  if (Array.isArray(obj.results)) return obj.results

  return []
}

export function extractInviteTotal(payload: unknown, headers: Headers | undefined, fallback: number): number {
  const fromHeader = extractPaginationTotal(headers, fallback)
  if (fromHeader !== fallback) return fromHeader

  if (!payload || typeof payload !== 'object') return fallback
  const obj = payload as Record<string, unknown>
  const directTotal = obj.total
  if (typeof directTotal === 'number') return directTotal

  const nested = obj.pagination
  if (nested && typeof nested === 'object') {
    const nestedTotal = (nested as Record<string, unknown>).total
    if (typeof nestedTotal === 'number') return nestedTotal
  }

  return fallback
}
