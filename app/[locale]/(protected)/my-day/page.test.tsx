import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MyDay from '@/app/[locale]/(protected)/my-day/page'
import { isSubmittedToday } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { getTodayMoodStory } from '@/requests/moodStory'
import { fetchPersonalGoals } from '@/requests/personalGoals'

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }))
jest.mock('@/helpers/mood.helpers', () => ({ isSubmittedToday: jest.fn() }))
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/userTimeZone', () => ({ getUserTimeZone: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ getLastMoodRecords: jest.fn(), getMoodRecords: jest.fn() }))
jest.mock('@/requests/moodStory', () => ({ getTodayMoodStory: jest.fn() }))
jest.mock('@/requests/personalGoals', () => ({ fetchPersonalGoals: jest.fn() }))
jest.mock('@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCard', () => ({
  MoodSummaryCard: ({ historyVerified }: { historyVerified: boolean }) => (
    <div data-testid="mood-summary" data-verified={String(historyVerified)} />
  ),
}))
jest.mock('@/components/features/MoodTracker/MoodStoryCard/MoodStoryCard', () => ({
  MoodStoryCard: () => <div data-testid="mood-story" />,
}))
jest.mock('@/components/features/MoodTracker/TodayMoodNotes/TodayMoodNotes', () => ({
  TodayMoodNotes: ({ record }: { record?: { id: string } | null }) =>
    record ? <div data-testid="today-record">{record.id}</div> : null,
}))
jest.mock('@/components/features/MyDay/DailyHabitsCard', () => ({
  DailyHabitsCard: () => <div data-testid="daily-habits" />,
}))
jest.mock('@/components/features/Tips/DailyTipClient', () => ({
  DailyTipClient: () => <div data-testid="tip" />,
}))
jest.mock('@/components/features/Affirmations/DailyAffirmationClient', () => ({
  DailyAffirmationClient: () => <div data-testid="affirmation" />,
}))
jest.mock('@/components/features/MyProgress/PersonalGoals/PersonalGoalsList', () => ({
  PersonalGoalsList: () => <div data-testid="goals" />,
}))
jest.mock('@/components/features/MyProgress/PersonalGoals/DeadlineCountdown', () => ({
  DeadlineCountdown: () => <div data-testid="deadline" />,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'qa-1', role: 'user' } })
  ;(getUserTimeZone as jest.Mock).mockResolvedValue('Europe/Warsaw')
  ;(getLastMoodRecords as jest.Mock).mockResolvedValue({
    data: [{ id: 'record-1', createdAt: '2026-10-19T23:45:00.000Z' }],
  })
  ;(getMoodRecords as jest.Mock).mockResolvedValue({ data: { moodNotes: [], total: 0 } })
  ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ data: [] })
  ;(getTodayMoodStory as jest.Mock).mockResolvedValue({ data: { screens: [] } })
  ;(isSubmittedToday as jest.Mock).mockReturnValue(false)
})

describe('My Day local calendar boundary and visual hierarchy', () => {
  it('does not show a stale daily entry or yesterday story after local midnight', async () => {
    render(await MyDay())

    expect(getLastMoodRecords).toHaveBeenCalledWith(expect.anything(), {
      days: 1,
      limit: 1,
      timeZone: 'Europe/Warsaw',
      dailyOnly: true,
    })
    expect(screen.getByTestId('mood-summary')).toHaveAttribute('data-verified', 'true')
    expect(screen.queryByTestId('mood-story')).not.toBeInTheDocument()
    expect(screen.queryByTestId('today-record')).not.toBeInTheDocument()
    expect(getTodayMoodStory).not.toHaveBeenCalled()
  })

  it('shows the verified daily entry while retaining mood first, optional habits last', async () => {
    ;(isSubmittedToday as jest.Mock).mockReturnValue(true)
    const { container } = render(await MyDay())

    expect(getTodayMoodStory).toHaveBeenCalledWith(expect.anything(), 'Europe/Warsaw')
    expect(screen.getByTestId('mood-story')).toBeInTheDocument()
    expect(screen.getByTestId('today-record')).toHaveTextContent('record-1')

    const content = container.querySelector('article > div')
    expect(content).not.toBeNull()
    const widgets = Array.from(content?.children ?? []).map((element) => element.getAttribute('data-testid'))
    expect(widgets).toEqual(['mood-story', 'tip', 'today-record', 'daily-habits'])
  })

  it('fails closed when timezone is unknown, even if the backend returns a record', async () => {
    ;(getUserTimeZone as jest.Mock).mockResolvedValue(null)
    render(await MyDay())

    expect(getLastMoodRecords).toHaveBeenCalledWith(expect.anything(), { limit: 1, dailyOnly: true })
    expect(screen.getByTestId('mood-summary')).toBeInTheDocument()
    expect(screen.queryByTestId('today-record')).not.toBeInTheDocument()
    expect(getTodayMoodStory).not.toHaveBeenCalled()
  })

  it('does not enable daily submission when the server returns an invalid success payload', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: undefined })
    render(await MyDay())

    expect(screen.getByTestId('mood-summary')).toHaveAttribute('data-verified', 'false')
    expect(screen.queryByTestId('mood-story')).not.toBeInTheDocument()
  })

  it('does not claim a verified history after the backend fails', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })
    render(await MyDay())

    expect(screen.getByTestId('mood-summary')).toHaveAttribute('data-verified', 'false')
    expect(screen.queryByTestId('mood-story')).not.toBeInTheDocument()
  })
})
