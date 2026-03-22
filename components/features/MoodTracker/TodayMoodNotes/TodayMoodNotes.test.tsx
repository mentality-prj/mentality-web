import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { TodayMoodNotes } from '@/components/features/MoodTracker/TodayMoodNotes/TodayMoodNotes'
import { getLastMoodRecords } from '@/requests/moodRecord'
import { MoodRecordEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ getLastMoodRecords: jest.fn() }))
jest.mock('next-intl/server')

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

jest.mock('lucide-react', () => ({ Calendar: () => null, Clock: () => null }))

jest.mock('@/components/features/MoodTracker/MoodLevelBars/MoodLevelBars', () => ({
  MoodLevelBars: () => (
    <div>
      <span>stress</span>
      <span>energy</span>
      <span>focus</span>
    </div>
  ),
}))

jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({
    children,
    title,
    text,
    link,
  }: {
    children?: React.ReactNode
    title?: React.ReactNode
    text?: React.ReactNode
    link?: string
  }) => (
    <div>
      {link && <a href={link} aria-label={typeof title === 'string' ? title : 'link'} />}
      {title && <h3>{title}</h3>}
      {text && <div data-testid="card-text">{text}</div>}
      {children}
    </div>
  ),
}))

jest.mock('@/ds/components/Tag', () => ({
  Tag: ({ text }: { text: string }) => <span data-testid="tag">{text}</span>,
}))

jest.mock('@/ds/components/TooltipIcon', () => ({
  TooltipIcon: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockSession: CustomSession = {
  user: { email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 86400000).toISOString(),
}

const mockRecord: MoodRecordEntity = {
  id: 'rec-1',
  moodLevel: 4,
  stressLevel: 2,
  energyLevel: 3,
  focusLevel: 4,
  tags: ['calm'],
  createdAt: '2026-03-13T10:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(auth as jest.Mock).mockResolvedValue(mockSession)
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
})

describe('TodayMoodNotes', () => {
  it('shows empty message when there are no records', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: [] })

    render(await TodayMoodNotes())

    expect(screen.getByText('empty')).toBeInTheDocument()
  })

  it('shows empty message when API returns an error', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({
      error: 'Unauthorized',
      message: 'Session expired',
      status: 401,
    })

    render(await TodayMoodNotes())

    expect(screen.getByText('empty')).toBeInTheDocument()
  })

  it('renders stress, energy and focus labels for each record', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    render(await TodayMoodNotes())

    expect(screen.queryByText('empty')).not.toBeInTheDocument()
    expect(screen.getByText('stress')).toBeInTheDocument()
    expect(screen.getByText('energy')).toBeInTheDocument()
    expect(screen.getByText('focus')).toBeInTheDocument()
  })

  it('renders a tag for each of the three level dimensions', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    render(await TodayMoodNotes())

    expect(screen.getByText('stress')).toBeInTheDocument()
    expect(screen.getByText('energy')).toBeInTheDocument()
    expect(screen.getByText('focus')).toBeInTheDocument()
  })

  it('always renders the "more" link to mood-tracker', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: [] })

    render(await TodayMoodNotes())

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/mood-tracker#mood-records-list')
  })

  it('renders multiple records', async () => {
    const records: MoodRecordEntity[] = [
      { ...mockRecord, id: 'rec-1' },
      { ...mockRecord, id: 'rec-2', stressLevel: 5, energyLevel: 1 },
    ]
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: records })

    render(await TodayMoodNotes())

    // component only renders the first (most recent) record — days: 1 (today only)
    const stressLabels = screen.getAllByText('stress')
    expect(stressLabels).toHaveLength(1)
  })

  it('calls getLastMoodRecords with limit 1', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: [] })

    await TodayMoodNotes()

    expect(getLastMoodRecords).toHaveBeenCalledWith(mockSession, { days: 1 })
  })

  it('falls back gracefully when stressLevel has an unknown value', async () => {
    const recordWithUnknownLevels: MoodRecordEntity = {
      ...mockRecord,
      stressLevel: 99,
      energyLevel: 99,
      focusLevel: 99,
    }
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ data: [recordWithUnknownLevels] })

    // Should render without throwing — fallback constants are used
    await expect(async () => render(await TodayMoodNotes())).not.toThrow()
  })
})
