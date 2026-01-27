export const Statuses = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const)

export type GoalStatus = (typeof Statuses)[keyof typeof Statuses]
