import { render, screen } from '@testing-library/react'

import { getServerSession } from '@/lib/get-server-session'
import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import { getUserTimeZone } from '@/lib/userTimeZone'
import { getLastMoodRecords } from '@/requests/moodRecord'

import { NewMoodNoteSection } from './NewMoodNoteSection'

jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/userTagsNormalizer', () => ({ fetchNormalizedUserTags: jest.fn() }))
jest.mock('@/lib/userTimeZone', () => ({ getUserTimeZone: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ getLastMoodRecords: jest.fn() }))
jest.mock('./NewMoodNoteSectionClient', () => ({
  __esModule: true,
  default: ({
    timeZone,
    initialLastSubmittedAt,
    historyVerified,
  }: {
    timeZone: string | null
    initialLastSubmittedAt: string | null
    historyVerified: boolean
  }) => (
    <div
      data-testid="mood-entry"
      data-zone={timeZone ?? ''}
      data-last-submitted={initialLastSubmittedAt ?? ''}
      data-verified={String(historyVerified)}
    />
  ),
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } })
  ;(getUserTimeZone as jest.Mock).mockResolvedValue('Europe/Warsaw')
  ;(fetchNormalizedUserTags as jest.Mock).mockResolvedValue({ data: [] })
  ;(getLastMoodRecords as jest.Mock).mockResolvedValue({
    data: [{ id: 'today', createdAt: '2026-10-17T22:10:00.000Z' }],
  })
})

describe('NewMoodNoteSection user-local day', () => {
  it('reads only the verified local calendar day for the Mood Tracker daily-limit form', async () => {
    render(await NewMoodNoteSection())

    expect(getLastMoodRecords).toHaveBeenCalledWith(expect.anything(), {
      days: 1,
      limit: 1,
      timeZone: 'Europe/Warsaw',
      dailyOnly: true,
    })
    expect(screen.getByTestId('mood-entry')).toHaveAttribute('data-zone', 'Europe/Warsaw')
    expect(screen.getByTestId('mood-entry')).toHaveAttribute('data-last-submitted', '2026-10-17T22:10:00.000Z')
  })

  it('preserves the latest timestamp fallback while the browser zone is unknown', async () => {
    ;(getUserTimeZone as jest.Mock).mockResolvedValue(null)
    render(await NewMoodNoteSection())

    expect(getLastMoodRecords).toHaveBeenCalledWith(expect.anything(), { limit: 1, dailyOnly: true })
    expect(screen.getByTestId('mood-entry')).toHaveAttribute('data-zone', '')
  })

  it('marks a failed daily history read unverified rather than allowing an unchecked submission', async () => {
    ;(getLastMoodRecords as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })
    render(await NewMoodNoteSection())

    expect(screen.getByTestId('mood-entry')).toHaveAttribute('data-verified', 'false')
    expect(screen.getByTestId('mood-entry')).toHaveAttribute('data-last-submitted', '')
  })
})
