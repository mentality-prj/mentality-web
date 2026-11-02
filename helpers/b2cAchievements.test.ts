import type { DiaryEntity, GoalEntity } from '@/types/api-responses'

import { completedGoalCount, diaryEntryCount, earnedMilestones, validActivityCount } from './b2cAchievements'

function goal(status: GoalEntity['status']): GoalEntity {
  return { id: status, text: 'Personal activity', check: 0, repeat: 1, status, category: 'default' }
}

describe('personal achievements from existing B2C records', () => {
  it('recognizes cumulative milestones without streaks or consecutive-day logic', () => {
    expect(earnedMilestones('mood', 0)).toEqual([])
    expect(earnedMilestones('mood', 1).map((item) => item.key)).toEqual(['firstCheckin'])
    expect(earnedMilestones('mood', 5).map((item) => item.key)).toEqual(['firstCheckin', 'fiveCheckins'])
    expect(earnedMilestones('diary', 5).map((item) => item.key)).toEqual(['firstDiary', 'fiveDiaries'])
    expect(earnedMilestones('goals', 3).map((item) => item.key)).toEqual(['firstGoal', 'threeGoals'])
  })

  it('does not present malformed or unavailable mood totals as achievements', () => {
    for (const value of [-1, NaN, Infinity, -Infinity, 0.5, undefined, '5', null]) {
      expect(validActivityCount(value)).toBeNull()
    }
    expect(validActivityCount(0)).toBe(0)
    expect(validActivityCount(5)).toBe(5)
    expect(earnedMilestones('mood', -10)).toEqual([])
  })

  it('counts archived diary entries without revealing their text', () => {
    const entries: DiaryEntity[] = [
      { id: 'a', content: 'private text', isActive: false },
      { id: 'b', content: 'another private text', isActive: true },
    ]
    expect(diaryEntryCount(entries)).toBe(2)
  })

  it('recognizes only completed personal goals, not overdue or failed ones', () => {
    const goals = [goal('pending'), goal('in progress'), goal('failed'), goal('completed'), goal('completed')]
    expect(completedGoalCount(goals)).toBe(2)
  })
})
