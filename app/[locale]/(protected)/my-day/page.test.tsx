import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MyDay from '@/app/[locale]/(protected)/my-day/page'
import { isSubmittedToday } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { getTodayMoodStory } from '@/requests/moodStory'
import { fetchPersonalGoals } from '@/requests/personalGoals'

jest.mock('next-intl/server')
jest.mock('@/helpers/mood.helpers', () => ({ isSubmittedToday: jest.fn() }))
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/userTimeZone', () => ({ getUserTimeZone: jest.fn() }))
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
jest.mock('@/components/features/Guide/MoodNextStepCard', () => ({
  MoodNextStepCard: ({ record }: { record: { stressLevel?: number } }) => (
    <div data-testid="mood-next-step">{record.stressLevel}</div>
  ),
}))
jest.mock('@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCard', () => ({
  MoodSummaryCard: ({
    initialLastSubmittedAt,
    historyVerified,
  }: {
    initialLastSubmittedAt?: string | null
    historyVerified?: boolean
  }) => (
    <div
      data-testid="mood-prompt"
      data-last-submitted-at={initialLastSubmittedAt ?? ''}
      data-history-verified={String(historyVerified)}
    />
  ),
}))
jest.mock('@/components/features/MoodTracker/MoodStoryCard/MoodStoryCard', () => ({
  MoodStoryCard: () => <div data-testid="mood-story" />,
}))
jest.mock('@/components/features/MoodTracker/TodayMoodNotes/TodayMoodNotes', () => ({
  TodayMoodNotes: () => <div data-testid="today-mood" />,
}))
jest.mock('@/components/features/Affirmations/DailyAffirmationClient', () => ({
  DailyAffirmationClient: () => <div />,
}))
jest.mock('@/components/features/Tips/DailyTipClient', () => ({
  DailyTipClient: () => <div />,
}))
jest.mock('@/components/features/MyProgress/PersonalGoals/PersonalGoalsList', () => ({
  PersonalGoalsList: () => <div />,
}))
jest.mock('@/components/features/MyProgress/PersonalGoals/DeadlineCountdown', () => ({
  DeadlineCountdown: () => <div />,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'qa-user', role: 'user' } })
  ;(getUserTimeZone as jest.Mock).mockResolvedValue('Europe/Warsaw')
  ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: [] })
  ;(getMoodRecords as jest.Mock).mockResolvedValue({ data: { moodNotes: [] } })
  ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ data: [] })
  ;(getTodayMoodStory as jest.Mock).mockResolvedValue({ error: 'Not ready', status: 404 })
  ;(isSubmittedToday as jest.Mock).mockReturnValue(true)
})

describe('My Day optional support', () => {
  it('shows grounding before any check-in is required', async () => {
    render(await MyDay())

    expect(getLastMoodRecords).toHaveBeenCalledWith(expect.anything(), { limit: 1 })
    expect(screen.getByTestId('mood-prompt')).toBeInTheDocument()
    expect(screen.getByTestId('quick-support')).toBeInTheDocument()
    expect(getTodayMoodStory).not.toHaveBeenCalled()
    expect(screen.queryByTestId('mood-next-step')).not.toBeInTheDocument()
  })

  it('does not show stale mood story or recommendations when only yesterday has a record', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({
      data: [{ id: 'yesterday', createdAt: '2026-10-16T21:00:00.000Z', stressLevel: 5 }],
    })
    ;(isSubmittedToday as jest.Mock).mockReturnValue(false)

    render(await MyDay())

    expect(screen.getByTestId('mood-prompt')).toBeInTheDocument()
    expect(screen.getByTestId('quick-support')).toBeInTheDocument()
    expect(screen.queryByTestId('mood-story')).not.toBeInTheDocument()
    expect(getTodayMoodStory).not.toHaveBeenCalled()
  })

  it('does not infer a day from the locale when time zone is unavailable', async () => {
    ;(getUserTimeZone as jest.Mock).mockResolvedValue(null)

    render(await MyDay())

    expect(screen.getByTestId('mood-prompt')).toBeInTheDocument()
    expect(screen.getByTestId('quick-support')).toBeInTheDocument()
    expect(getTodayMoodStory).not.toHaveBeenCalled()
  })

  it('passes last submission to browser gating before timezone cookie initialization', async () => {
    ;(getUserTimeZone as jest.Mock).mockResolvedValue(null)
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({
      data: [{ id: 'recent', createdAt: '2026-10-17T22:10:00.000Z', stressLevel: 4 }],
    })
    render(await MyDay())
    expect(screen.getByTestId('mood-prompt')).toHaveAttribute('data-last-submitted-at', '2026-10-17T22:10:00.000Z')
    expect(isSubmittedToday).not.toHaveBeenCalled()
  })

  it('blocks unverified history instead of treating an API failure as no submission', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })
    render(await MyDay())
    expect(screen.getByTestId('mood-prompt')).toHaveAttribute('data-history-verified', 'false')
  })

  it('keeps support visible even when a mood story is unavailable', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({
      data: [{ id: 'mood-1', createdAt: '2026-10-17T09:00:00.000Z', stressLevel: 4 }],
    })
    render(await MyDay())

    expect(screen.getByTestId('mood-story')).toBeInTheDocument()
    expect(screen.getByTestId('mood-next-step')).toHaveTextContent('4')
    expect(screen.queryByTestId('quick-support')).not.toBeInTheDocument()
  })
})
