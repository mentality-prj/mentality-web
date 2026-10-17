import type { DiaryEntity, GoalEntity } from '@/types/api-responses'
import { Statuses } from '@/types/goals'

/**
 * B2C achievements are a read-only view of existing personal records, not
 * persistent rewards or a mental-health score. No streaks or missed-day logic.
 */
export const ACTIVITY_MILESTONES = {
  mood: [
    { threshold: 1, key: 'firstCheckin' },
    { threshold: 5, key: 'fiveCheckins' },
  ],
  diary: [
    { threshold: 1, key: 'firstDiary' },
    { threshold: 5, key: 'fiveDiaries' },
  ],
  goals: [
    { threshold: 1, key: 'firstGoal' },
    { threshold: 3, key: 'threeGoals' },
  ],
} as const

export type ActivityKind = keyof typeof ACTIVITY_MILESTONES

export function validActivityCount(value: unknown): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null
}

export function diaryEntryCount(entries: DiaryEntity[]): number {
  // Archived entries remain personal activity: archiving cannot revoke progress.
  return entries.length
}

export function completedGoalCount(goals: GoalEntity[]): number {
  // Failed, pending and in-progress goals never count as completed.
  return goals.filter((goal) => goal.status === Statuses.COMPLETED).length
}

export function earnedMilestones(kind: ActivityKind, count: number) {
  const total = validActivityCount(count)
  return total === null ? [] : ACTIVITY_MILESTONES[kind].filter((milestone) => total >= milestone.threshold)
}
