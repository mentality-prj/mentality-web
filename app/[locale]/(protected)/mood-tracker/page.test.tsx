import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MoodTrackerPage from '@/app/[locale]/(protected)/mood-tracker/page'
import { buildDailySummaries, buildMoodMarksData, isSubmittedToday } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { getMoodStatistics } from '@/requests/userStatistics'
import { MoodRecordEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ getLastMoodRecords: jest.fn(), getMoodRecords: jest.fn() }))
jest.mock('@/requests/userStatistics', () => ({ getMoodStatistics: jest.fn() }))
jest.mock('next-intl/server')
jest.mock('@/helpers/mood.helpers', () => ({
  buildMoodMarksData: jest.fn().mockReturnValue({}),
  buildDailySummaries: jest.fn().mockReturnValue([]),
  isSubmittedToday: jest.fn().mockReturnValue(false),
}))

jest.mock('@/components/features/Guide/QuickSupportCard', () => ({
  QuickSupportCard: () => <div data-testid="quick-support" />,
}))
jest.mock('@/components/features/Guide/MoodNextStepCard', () => ({
  MoodNextStepCard: ({ record }: { record: MoodRecordEntity }) => (
    <div data-testid="mood-next-step">{record.stressLevel}</div>
  ),
}))

jest.mock('@/components/features/MoodTracker/MoodRecords/MoodRecords', () => ({
  MoodRecords: ({ records }: { records: MoodRecordEntity[] }) => (
    <div data-testid="mood-records">{records.length} records</div>
  ),
}))

jest.mock('@/components/features/MoodTracker/NewMoodNoteSection/NewMoodNoteSection', () => ({
  NewMoodNoteSection: () => <div data-testid="new-mood-note-section" />,
}))

jest.mock('@/components/features/MoodTracker/TenDaysSummary/TenDaysSummary', () => ({
  TenDaysSummary: () => <div data-testid="ten-days-summary" />,
}))

jest.mock('@/components/features/MoodTracker/WellbeingSummary/WellbeingSummary', () => ({
  WellbeingSummary: () => <div data-testid="wellbeing-summary" />,
}))
jest.mock('@/components/features/MoodTracker/MoodProgressSummary/MoodProgressSummary', () => ({
  MoodProgressSummary: ({ failed }: { failed?: boolean }) => (
    <div data-testid="mood-progress">{failed ? 'error' : 'ready'}</div>
  ),
}))

jest.mock('@/ds/components/PageTitle', () => ({
  PageTitle: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}))

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Test User', email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 86400000).toISOString(),
}

const mockRecords: MoodRecordEntity[] = [
  { id: 'r1', moodLevel: 4, stressLevel: 2, energyLevel: 3, focusLevel: 3, createdAt: '2026-03-13T10:00:00.000Z' },
  { id: 'r2', moodLevel: 2, stressLevel: 4, energyLevel: 2, focusLevel: 2, createdAt: '2026-03-12T10:00:00.000Z' },
]

beforeEach(() => {
  jest.clearAllMocks()
  ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: mockRecords })
  ;(getMoodRecords as jest.Mock).mockResolvedValue({
    data: { moodNotes: mockRecords, total: mockRecords.length },
  })
  ;(getMoodStatistics as jest.Mock).mockResolvedValue({ data: { totalRecords: 2, trend30d: [] } })
})

describe('MoodTracker page', () => {
  it('calls getLastMoodRecords with days: 10', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(getLastMoodRecords).toHaveBeenCalledWith(mockSession, { days: 10 })
  })

  it('renders page title and subtitle', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('renders NewMoodNoteSection', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId('new-mood-note-section')).toBeInTheDocument()
  })

  it('loads existing user mood statistics and renders progress without new endpoints', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))
    expect(getMoodStatistics).toHaveBeenCalledWith(mockSession)
    expect(screen.getByTestId('mood-progress')).toHaveTextContent('ready')
  })

  it('shows an explicit progress error state if the existing statistics request fails', async () => {
    ;(getMoodStatistics as jest.Mock).mockResolvedValue({ error: 'Backend unavailable' })
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId('mood-progress')).toHaveTextContent('error')
  })

  it('offers immediate support without requiring a mood submission', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId('quick-support')).toBeInTheDocument()
    expect(screen.queryByTestId('mood-next-step')).not.toBeInTheDocument()
  })

  it('shows a contextual next step only when the server has a current-day mood record', async () => {
    ;(isSubmittedToday as jest.Mock).mockReturnValue(true)
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId('mood-next-step')).toHaveTextContent('2')
    expect(screen.queryByTestId('quick-support')).not.toBeInTheDocument()
  })

  it('renders TenDaysSummary', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId('ten-days-summary')).toBeInTheDocument()
  })

  it('passes records from API to MoodRecords', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId('mood-records')).toHaveTextContent('2 records')
  })

  it('does not present a failed history request as an empty diary', async () => {
    ;(getMoodRecords as jest.Mock).mockResolvedValue({ error: 'Backend unavailable', status: 503 })

    await expect(MoodTrackerPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('Unable to load mood records')
    expect(buildMoodMarksData).not.toHaveBeenCalled()
  })

  it('calls buildMoodMarksData and buildDailySummaries with records', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(buildMoodMarksData).toHaveBeenCalledWith(mockRecords)
    expect(buildDailySummaries).toHaveBeenCalledWith(mockRecords)
  })

  it('does not present a failed summary request as valid zero-valued statistics', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ error: 'Backend unavailable' })

    await expect(MoodTrackerPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('Unable to load mood summary')
    expect(buildMoodMarksData).not.toHaveBeenCalled()
    expect(buildDailySummaries).not.toHaveBeenCalled()
  })
})
