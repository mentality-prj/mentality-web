import { render, screen } from '@testing-library/react'
import { getLocale, getTranslations } from 'next-intl/server'

import { TodayMoodNotes } from '@/components/features/MoodTracker/TodayMoodNotes/TodayMoodNotes'
import type { MoodRecordEntity } from '@/types/api-responses'

jest.mock('next-intl/server')
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
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
    link,
    tools,
    time,
  }: {
    children?: React.ReactNode
    title?: React.ReactNode
    link?: string
    tools?: React.ReactNode
    time?: string
  }) => (
    <div>
      {link && <a href={link} aria-label={typeof title === 'string' ? title : 'link'} />}
      {title && <h3>{title}</h3>}
      {time && <span data-testid="mood-time">{time}</span>}
      {tools}
      {children}
    </div>
  ),
}))

const mockRecord: MoodRecordEntity = {
  id: 'rec-1',
  moodLevel: 4,
  stressLevel: 2,
  energyLevel: 3,
  focusLevel: 4,
  tags: ['calm'],
  createdAt: '2026-10-17T22:10:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getLocale as jest.Mock).mockResolvedValue('uk')
})

describe('TodayMoodNotes', () => {
  it('does not show a record when My Day has not verified a full daily check-in', async () => {
    const { container } = render(await TodayMoodNotes({ record: null, timeZone: 'Europe/Warsaw' }))
    expect(container).toBeEmptyDOMElement()
  })

  it('does not infer today from server UTC or user locale without a verified time zone', async () => {
    const { container } = render(await TodayMoodNotes({ record: mockRecord, timeZone: null }))
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the verified record and links to mood history', async () => {
    render(await TodayMoodNotes({ record: mockRecord, timeZone: 'Europe/Warsaw' }))
    expect(screen.getByText('stress')).toBeInTheDocument()
    expect(screen.getByText('energy')).toBeInTheDocument()
    expect(screen.getByText('focus')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'title' })).toHaveAttribute('href', '/mood-tracker#mood-records-list')
    // After UTC 22:00 Warsaw is already on the next local calendar day.
    expect(screen.getByTestId('mood-time')).toHaveTextContent('00:10')
  })

  it('keeps rendering when a historical record has an unexpected level', async () => {
    render(
      await TodayMoodNotes({
        record: { ...mockRecord, stressLevel: 99, energyLevel: 99, focusLevel: 99 },
        timeZone: 'Europe/Warsaw',
      })
    )
    expect(screen.getByText('stress')).toBeInTheDocument()
  })
})
