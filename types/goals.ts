export const Statuses = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const)

export type GoalStatus = (typeof Statuses)[keyof typeof Statuses]

export const GoalCategories = Object.freeze({
  DEFAULT: 'default',
  FOOD: 'food',
  READING: 'reading',
  SOCIAL: 'social',
  JOURNALING: 'journaling',
  NO_PHONE: 'noPhone',
  WALK: 'walk',
  ART: 'art',
  SLEEP: 'sleep',
  SPORT: 'sport',
  LEARNING: 'learning',
  HEALTH: 'health',
  MEDITATION: 'meditation',
} as const)

export type GoalCategory = (typeof GoalCategories)[keyof typeof GoalCategories]
