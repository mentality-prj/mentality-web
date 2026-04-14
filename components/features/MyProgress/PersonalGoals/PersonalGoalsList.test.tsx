import { render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { PersonalGoalsList } from '@/components/features/MyProgress/PersonalGoals/PersonalGoalsList'
import { useAuth } from '@/context/AuthProvider'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { GoalEntity } from '@/types/api-responses'

jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('next-intl')
jest.mock('@/requests/personalGoals', () => ({ fetchPersonalGoals: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

jest.mock('@/components/features/MyProgress/PersonalGoals/CreatePersonalGoals', () => ({
  CreatePersonalGoals: () => <div data-testid="create-personal-goals" />,
}))

jest.mock('@/components/features/MyProgress/PersonalGoals/PersonalGoalsCard', () => ({
  PersonalGoalsCard: ({ text }: { text: string }) => <div data-testid="goal-card">{text}</div>,
}))

jest.mock('@/components/features/MyProgress/PersonalGoals/personalGoalSuggestions', () => ({
  buildGoalIconLookup: () => ({}),
}))

const mockSession = { user: { email: 'test@test.com' }, OAuthToken: 'token' }

const mockGoal = (overrides?: Partial<GoalEntity>): GoalEntity => ({
  id: '1',
  text: 'Go for a walk',
  status: 'pending',
  repeat: 0,
  check: 0,
  deadline: undefined,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  category: 'default',
  ...overrides,
})

beforeEach(() => {
  jest.clearAllMocks()
  ;(useAuth as jest.Mock).mockReturnValue({ session: mockSession, status: 'authenticated' })
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ data: [] })
})

describe('PersonalGoalsList', () => {
  it('renders CreatePersonalGoals form when showCreate=true', async () => {
    render(<PersonalGoalsList filter="all" showCreate={true} />)

    await waitFor(() => {
      expect(screen.getByTestId('create-personal-goals')).toBeInTheDocument()
    })
  })

  it('renders goal cards for fetched goals', async () => {
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({
      data: [mockGoal({ id: '1', text: 'Goal A' }), mockGoal({ id: '2', text: 'Goal B' })],
    })

    render(<PersonalGoalsList filter="all" showCreate={false} />)

    await waitFor(() => {
      expect(screen.getAllByTestId('goal-card')).toHaveLength(2)
      expect(screen.getByText('Goal A')).toBeInTheDocument()
      expect(screen.getByText('Goal B')).toBeInTheDocument()
    })
  })

  it('shows empty state when showCreate=false and no goals', async () => {
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ data: [] })

    render(<PersonalGoalsList filter="all" showCreate={false} />)

    await waitFor(() => {
      expect(screen.getByText('EmptyTitle')).toBeInTheDocument()
      expect(screen.getByText('EmptyText')).toBeInTheDocument()
      // CreatePersonalGoals still appears in empty state
      expect(screen.getByTestId('create-personal-goals')).toBeInTheDocument()
    })
  })

  it('does not show empty state when showCreate=true', async () => {
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ data: [] })

    render(<PersonalGoalsList filter="all" showCreate={true} />)

    await waitFor(() => {
      expect(screen.queryByText('EmptyTitle')).not.toBeInTheDocument()
    })
  })

  it('respects limit and shows ViewAll link when limit exceeded', async () => {
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({
      data: [
        mockGoal({ id: '1', text: 'Goal 1' }),
        mockGoal({ id: '2', text: 'Goal 2' }),
        mockGoal({ id: '3', text: 'Goal 3' }),
      ],
    })

    render(<PersonalGoalsList filter="all" showCreate={false} limit={2} viewAllHref="/goals" />)

    await waitFor(() => {
      expect(screen.getAllByTestId('goal-card')).toHaveLength(2)
      expect(screen.getByRole('link', { name: 'ViewAll' })).toHaveAttribute('href', '/goals')
    })
  })

  it('does not show ViewAll link when goals are within limit', async () => {
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({
      data: [mockGoal({ id: '1', text: 'Goal 1' })],
    })

    render(<PersonalGoalsList filter="all" showCreate={false} limit={2} viewAllHref="/goals" />)

    await waitFor(() => {
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  it('renders only pending/in-progress goals when filter=pending', async () => {
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({
      data: [
        mockGoal({ id: '1', text: 'Active', status: 'pending' }),
        mockGoal({ id: '2', text: 'Done', status: 'completed' }),
      ],
    })

    render(<PersonalGoalsList filter="pending" showCreate={false} />)

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.queryByText('Done')).not.toBeInTheDocument()
    })
  })

  it('uses initialGoals when provided and skips fetching', async () => {
    const initialGoals = [mockGoal({ id: 'init-1', text: 'Initial Goal' })]

    render(<PersonalGoalsList filter="all" showCreate={false} initialGoals={initialGoals} />)

    expect(screen.getByText('Initial Goal')).toBeInTheDocument()
    expect(fetchPersonalGoals).not.toHaveBeenCalled()
  })
})
