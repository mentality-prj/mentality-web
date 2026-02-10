// Single source of truth for sort order types
export type SortOrder = 'newest' | 'oldest'

export const SORT_ORDER = {
  NEWEST: 'newest' as const,
  OLDEST: 'oldest' as const,
} as const
