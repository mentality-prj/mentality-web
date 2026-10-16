import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MyProgress from '@/app/[locale]/(protected)/my-progress/page'
import { getServerSession } from '@/lib/get-server-session'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { getMoodStatistics } from '@/requests/userStatistics'
import type { GoalEntity } from '@/types/api-responses'
import type { CustomSession } from '@/types/auth'
import type { MoodStatistics } from '@/types/userStatistics'

jest.mock('next-intl/server')
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/personalGoals', () => ({ fetchPersonalGoals: jest.fn() }))
jest.mock('@/requests/userStatistics', () => ({ getMoodStatistics: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/ds/components/SectionCard', () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/components/features/MoodTracker/MoodProgressSummary/MoodProgressSummary', () => ({
  MoodProgressSummary: ({ stats, failed }: { stats: MoodStatistics | null; failed?: boolean }) => (
    <div data-testid="mood-progress">{failed ? 'failed' : stats?.totalRecords ?? 'empty'}</div>
  ),
}))
jest.mock('@/components/features/MyProgress/PersonalGoals/PersonalGoalsList', () => ({
  PersonalGoalsList: ({ initialGoals }: { initialGoals?: GoalEntity[] }) => (
    <div data-testid="goals-list">{initialGoals?.length ?? 0}</div>
  ),
}))

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Test User', email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 86400000).toISOString(),
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  ;(getMoodStatistics as jest.Mock).mockResolvedValue({ data: { totalRecords: 8, trend30d: [] } })
  ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ data: [{ id: 'goal-1', text: 'Take a walk' }] })
})

describe('My Progress B2C overview', () => {
  it('shows real mood and goal data using the authenticated user session', async () => {
    render(await MyProgress())

    expect(getMoodStatistics).toHaveBeenCalledWith(mockSession)
    expect(fetchPersonalGoals).toHaveBeenCalledWith(mockSession)
    expect(screen.getByTestId('mood-progress')).toHaveTextContent('8')
    expect(screen.getByTestId('goals-list')).toHaveTextContent('1')
  })

  it('links to diary, mood history and all personal goals', async () => {
    render(await MyProgress())

    expect(screen.getByRole('link', { name: 'diaryLink' })).toHaveAttribute('href', '/diary')
    expect(screen.getByRole('link', { name: 'moodLink' })).toHaveAttribute('href', '/mood-tracker#mood-records-list')
    expect(screen.getByRole('link', { name: 'goalsLink' })).toHaveAttribute('href', '/my-progress/goals')
  })

  it('distinguishes mood statistics failure from having no check-ins', async () => {
    ;(getMoodStatistics as jest.Mock).mockResolvedValue({ error: 'Unavailable' })
    render(await MyProgress())

    expect(screen.getByTestId('mood-progress')).toHaveTextContent('failed')
    expect(screen.getByTestId('goals-list')).toBeInTheDocument()
  })

  it('shows a translated goals error instead of an empty goals list', async () => {
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ error: 'Unavailable' })
    render(await MyProgress())

    expect(screen.getByRole('alert')).toHaveTextContent('goalsError')
    expect(screen.queryByTestId('goals-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('mood-progress')).toHaveTextContent('8')
  })
})
