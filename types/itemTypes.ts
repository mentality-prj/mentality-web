// Single source of truth for item types and their plural forms.
export const ITEM_TYPE_DEFS = {
  affirmations: 'affirmations',
  tips: 'tips',
  exercises: 'exercises',
  goals: 'goals',
} as const

export type ItemType = keyof typeof ITEM_TYPE_DEFS

export const plural: Record<ItemType, string> = ITEM_TYPE_DEFS

export const ITEM_TYPES: ItemType[] = Object.keys(ITEM_TYPE_DEFS) as ItemType[]

export default ITEM_TYPE_DEFS
