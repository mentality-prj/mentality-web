import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MoodTrackerPage from '@/app/[locale]/(protected)/mood-tracker/page'
import { buildDailySummaries, buildMoodMarksData } from '@/helpers/mood.helpers'
import { getServerSession } from '@/lib/get-server-session'
import { getLastMoodRecords, getMoodRecords } from '@/requests/moodRecord'
import { MoodRecordEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ getLastMoodRecords: jest.fn(), getMoodRecords: jest.fn() }))
jest.mock('next-intl/server')
jest.mock('@/helpers/mood.helpers', () => ({
  buildMoodMarksData: jest.fn().mockReturnValue({}),
  buildDailySummaries: jest.fn().mockReturnValue([]),
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
})

describe('MoodTracker page', () => {
  it('calls getLastMoodRecords with days: 10', async () => {
    render(await MoodTrackerPage({ searchParams: {} }))

    expect(getLastMoodRecords).toHaveBeenCalledWith(mockSession, { days: 10 })
  })

  it('renders page title and subtitle', async () => {
    render(await MoodTrackerPage({ searchParams: {} }))

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('renders NewMoodNoteSection', async () => {
    render(await MoodTrackerPage({ searchParams: {} }))

    expect(screen.getByTestId('new-mood-note-section')).toBeInTheDocument()
  })

  it('renders TenDaysSummary', async () => {
    render(await MoodTrackerPage({ searchParams: {} }))

    expect(screen.getByTestId('ten-days-summary')).toBeInTheDocument()
  })

  it('passes records from API to MoodRecords', async () => {
    render(await MoodTrackerPage({ searchParams: {} }))

    expect(screen.getByTestId('mood-records')).toHaveTextContent('2 records')
  })

  it('passes empty records to MoodRecords when API returns an error', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({
      error: 'Forbidden',
      message: 'No access',
      status: 403,
    })
    ;(getMoodRecords as jest.Mock).mockResolvedValue({
      data: { moodNotes: [], total: 0 },
    })

    render(await MoodTrackerPage({ searchParams: {} }))

    expect(screen.getByTestId('mood-records')).toHaveTextContent('0 records')
  })

  it('calls buildMoodMarksData and buildDailySummaries with records', async () => {
    render(await MoodTrackerPage({ searchParams: {} }))

    expect(buildMoodMarksData).toHaveBeenCalledWith(mockRecords)
    expect(buildDailySummaries).toHaveBeenCalledWith(mockRecords)
  })

  it('passes empty array to helpers when API returns an error', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ error: 'error' })

    render(await MoodTrackerPage({ searchParams: {} }))

    expect(buildMoodMarksData).toHaveBeenCalledWith([])
    expect(buildDailySummaries).toHaveBeenCalledWith([])
  })
})
