import { render, screen } from '@testing-library/react'

import { MoodSummaryCard } from '@/features/mood/ui/MoodSummaryCard'
import { getServerSession } from '@/lib/get-server-session'
import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import { getUserTimeZone } from '@/lib/userTimeZone'

jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/userTimeZone', () => ({ getUserTimeZone: jest.fn() }))
jest.mock('@/lib/userTagsNormalizer', () => ({ fetchNormalizedUserTags: jest.fn() }))
jest.mock('@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCardClient', () => ({
  __esModule: true,
  default: ({ timeZone }: { timeZone?: string | null }) => (
    <div data-testid="my-day-mood-time-zone">{timeZone ?? 'unavailable'}</div>
  ),
}))

describe('My Day entry timezone', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'qa-user' } })
    ;(fetchNormalizedUserTags as jest.Mock).mockResolvedValue({ data: [] })
  })

  it('passes the same verified timezone to the mood modal as the server day view', async () => {
    ;(getUserTimeZone as jest.Mock).mockResolvedValue('Europe/Warsaw')
    render(await MoodSummaryCard({}))

    expect(screen.getByTestId('my-day-mood-time-zone')).toHaveTextContent('Europe/Warsaw')
    expect(getUserTimeZone).toHaveBeenCalledTimes(1)
  })

  it('does not guess a timezone when no verified browser zone is available', async () => {
    ;(getUserTimeZone as jest.Mock).mockResolvedValue(null)
    render(await MoodSummaryCard({}))

    expect(screen.getByTestId('my-day-mood-time-zone')).toHaveTextContent('unavailable')
  })
})
