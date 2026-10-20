import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MyDay from '@/app/[locale]/(protected)/my-day/page'
import { isSubmittedToday } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { getDailyHabits } from '@/requests/dailyHabits'
import { getTodayDiaryStatus } from '@/requests/diary'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { getTodayMoodStory } from '@/requests/moodStory'
import { fetchPersonalGoals } from '@/requests/personalGoals'

jest.mock('next-intl/server')
jest.mock('@/helpers/mood.helpers', () => ({ isSubmittedToday: jest.fn() }))
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/userTimeZone', () => ({ getUserTimeZone: jest.fn() }))
jest.mock('@/requests/diary', () => ({ getTodayDiaryStatus: jest.fn() }))
jest.mock('@/requests/dailyHabits', () => ({ getDailyHabits: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({
  getLastMoodRecords: jest.fn(),
  getMoodRecords: jest.fn(),
}))
jest.mock('@/requests/moodStory', () => ({ getTodayMoodStory: jest.fn() }))
jest.mock('@/requests/personalGoals', () => ({ fetchPersonalGoals: jest.fn() }))
jest.mock('@/helpers/moodProgress', () => ({ calculateMoodProgress: jest.fn() }))
jest.mock('@/components/features/Guide/QuickSupportCard', () => ({
  QuickSupportCard: () => <div data-testid="quick-support" />,
}))
jest.mock('@/components/features/Guide/SafetyResources', () => ({
  SafetyResources: () => <div data-testid="safety-resources" />,
}))
jest.mock('@/components/features/MyDay/DailyHabitsCard', () => ({
  DailyHabitsCard: ({
    initialHabits,
    failed,
    timeZone,
  }: {
    initialHabits: Array<{ kind: string; doneToday: boolean }>
    failed: boolean
    timeZone: string | null
  }) => (
    <div
      data-testid="daily-habits"
      data-state={failed ? '...[truncated]