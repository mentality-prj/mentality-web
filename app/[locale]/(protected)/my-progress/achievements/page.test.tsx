import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import MyProgressAchievementsPage from '@/app/[locale]/(protected)/my-progress/achievements/page'
import { getServerSession } from '@/lib/get-server-session'
import { getUserDiaries } from '@/requests/diary'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { getMoodStatistics } from '@/requests/userStatistics'
import type { CustomSession } from '@/types/auth'

jest.mock('next-intl/server')
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/diary', () => ({ getUserDiaries: jest.fn() }))
jest.mock('@/requests/personalGoals', () => ({ fetchPersonalGoals: jest.fn() }))
jest.mock('@/requests/userStatistics', () => ({ getMoodStatistics: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/ds/components/SectionCard', () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'QA', email: 'qa@example.test' },
  OAuthToken: 'server-only-test-token',
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  ;(getMoodStatistics as jest.Mock).mockResolvedValue({ data: { totalRecords: 5 } })
  ;(getUserDiaries as jest.Mock).mockResolvedValue({
    data: [{ id: 'entry-a', content: 'private diary content', isActive: true }],
  })
  ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({
    data: [
      { id: 'a', status: 'completed' },
      { id: 'b', status: 'pending' },
    ],
  })
})

describe('My Achievements B2C page', () => {
  it('shows only earned, source-backed achievements, never private diary text', async () => {
    render(await MyProgressAchievementsPage())

    expect(getMoodStatistics).toHaveBeenCalledWith(mockSession)
    expect(getUserDiaries).toHaveBeenCalledWith(mockSession)
    expect(fetchPersonalGoals).toHaveBeenCalledWith(mockSession)
    expect(screen.getByText('milestones.firstCheckin')).toBeInTheDocument()
    expect(screen.getByText('milestones.fiveCheckins')).toBeInTheDocument()
    expect(screen.getByText('milestones.firstDiary')).toBeInTheDocument()
    expect(screen.getByText('milestones.firstGoal')).toBeInTheDocument()
    expect(screen.queryByText('milestones.fiveDiaries')).not.toBeInTheDocument()
    expect(screen.queryByText('milestones.threeGoals')).not.toBeInTheDocument()
    expect(screen.queryByText('private diary content')).not.toBeInTheDocument()
  })

  it('shows a supportive state without fabricated awards for a new user', async () => {
    ;(getMoodStatistics as jest.Mock).mockResolvedValue({ data: { totalRecords: 0 } })
    ;(getUserDiaries as jest.Mock).mockResolvedValue({ data: [] })
    ;(fetchPersonalGoals as jest.Mock).mockResolvedValue({ data: [] })

    render(await MyProgressAchievementsPage())

    expect(screen.getAllByText('noMilestonesYet')).toHaveLength(3)
    expect(screen.queryByText('milestones.firstCheckin')).not.toBeInTheDocument()
    expect(screen.getByText('noPressure')).toBeInTheDocument()
  })

  it('keeps available achievements when a different personal API fails', async () => {
    ;(getUserDiaries as jest.Mock).mockResolvedValue({ error: 'Backend temporarily unavailable' })
    render(await MyProgressAchievementsPage())

    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByText('milestones.fiveCheckins')).toBeInTheDocument()
    expect(screen.getByText('milestones.firstGoal')).toBeInTheDocument()
    expect(screen.queryByText('milestones.firstDiary')).not.toBeInTheDocument()
    expect(screen.queryByText('noMilestonesYet')).not.toBeInTheDocument()
  })

  it('does not convert a broken mood count into zero or an earned milestone', async () => {
    ;(getMoodStatistics as jest.Mock).mockResolvedValue({ data: { totalRecords: -2 } })
    render(await MyProgressAchievementsPage())

    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.queryByText('milestones.firstCheckin')).not.toBeInTheDocument()
    expect(screen.getByText('milestones.firstDiary')).toBeInTheDocument()
  })

  it('links to the existing B2C history and goals screens', async () => {
    render(await MyProgressAchievementsPage())

    expect(screen.getByRole('link', { name: 'mood.action' })).toHaveAttribute('href', '/mood-tracker#mood-records-list')
    expect(screen.getByRole('link', { name: 'diary.action' })).toHaveAttribute('href', '/diary')
    expect(screen.getByRole('link', { name: 'goals.action' })).toHaveAttribute('href', '/my-progress/goals')
  })
})
