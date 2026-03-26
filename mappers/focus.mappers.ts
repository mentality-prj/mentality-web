export type FocusKey = 'veryLow' | 'low' | 'middle' | 'high' | 'veryHigh'

const FOCUS_KEY_TO_LEVEL: Record<FocusKey, number> = {
  veryLow: 1,
  low: 2,
  middle: 3,
  high: 4,
  veryHigh: 5,
}

export const FOCUS_KEYS: FocusKey[] = Object.keys(FOCUS_KEY_TO_LEVEL) as FocusKey[]

export function focusKeyToLevel(key?: string | null): number | undefined {
  if (!key) return undefined
  return (FOCUS_KEY_TO_LEVEL as Record<string, number>)[key as string]
}

export function levelToFocusKey(level: number): FocusKey | undefined {
  const entry = Object.entries(FOCUS_KEY_TO_LEVEL).find(([, v]) => v === level)
  return entry ? (entry[0] as FocusKey) : undefined
}
