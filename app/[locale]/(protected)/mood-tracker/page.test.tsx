import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MoodTrackerPage from '@/app/[locale]/(protected)/mood-tracker/page'
import { buildDailySummaries, buildMoodMarksData } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { MoodRecordEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/userTimeZone', () => ({ getUserTimeZone: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ getLastMoodRecords: jest.fn(), getMoodRecords: jest.fn() }))
jest.mock('next-intl/server')
jest.mock('@/helpers/mood.helpers', () => ({
  buildMoodMarksData: jest.fn().mockReturnValue({}),
  buildDailySummaries: jest.fn().mockReturnValue([]),
  isSubmittedToday: jest.fn().mockReturnValue(false),
}))

jest.mock('@/components/features/Guide/MoodNextStepCard', () => ({
  MoodNextStepCard: () => <div data-testid="mood-next-step" />,
}))
jest.mock('@/components/features/Guide/QuickSupportCard', () => ({
  QuickSupportCard: () => <div data-testid="quick-support" />,
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
  ;(getUserTimeZone as jest.Mock).mockResolvedValue('Europe/Warsaw')
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: mockRecords })
  ;(getMoodRecords as jest.Mock).mockResolvedValue({
    data: { moodNotes: mockRecords, total: mockRecords.length },
  })
})

describe('MoodTracker page', () => {
  it('calls getLastMoodRecords with days: 10', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(getLastMoodRecords).toHaveBeenCalledWith(mockSession, { days: 10, limit: 100, timeZone: 'Europe/Warsaw' })
    expect(getLastMoodRecords).toHaveBeenCalledWith(mockSession, {
      days: 1,
      limit: 1,
      timeZone: 'Europe/Warsaw',
      dailyOnly: true,
    })
  })

  it('renders page title and subtitle', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('renders NewMoodNoteSection', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId('new-mood-note-section')).toBeInTheDocument()
    expect(screen.getByTestId('quick-support')).toBeInTheDocument()
    expect(screen.queryByTestId('mood-next-step')).not.toBeInTheDocument()
  })

  it('renders TenDaysSummary', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId('ten-days-summary')).toBeInTheDocument()
  })

  it('passes records from API to MoodRecords', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId('mood-records')).toHaveTextContent('2 records')
  })

  it('fails closed if local-day history is unreadable rather than showing zero records', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ error: 'Forbidden', status: 403 })

    await expect(MoodTrackerPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('Unable to load mood summary')
    expect(buildDailySummaries).not.toHaveBeenCalled()
  })

  it('calls buildMoodMarksData and buildDailySummaries with records', async () => {
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(buildMoodMarksData).toHaveBeenCalledWith(mockRecords)
    expect(buildDailySummaries).toHaveBeenCalledWith(mockRecords, 'Europe/Warsaw')
  })

  it('rejects an undefined history payload rather than rendering an empty summary', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: undefined })

    await expect(MoodTrackerPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('Unable to load mood summary')
    expect(buildMoodMarksData).not.toHaveBeenCalled()
  })

  it('never substitutes an empty mood history after a read failure', async () => {
    ;(getMoodRecords as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })

    await expect(MoodTrackerPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('Unable to load mood records')
    expect(buildMoodMarksData).not.toHaveBeenCalled()
  })

  it('hides local-day summaries while the IANA timezone is unknown', async () => {
    ;(getUserTimeZone as jest.Mock).mockResolvedValue(null)
    render(await MoodTrackerPage({ searchParams: Promise.resolve({}) }))

    expect(getLastMoodRecords).toHaveBeenCalledWith(mockSession, { days: 10, limit: 100, timeZone: undefined })
    expect(screen.queryByTestId('ten-days-summary')).not.toBeInTheDocument()
  })
})
