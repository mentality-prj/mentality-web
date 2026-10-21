import { fireEvent, render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { MoodNextStepCard } from '@/components/features/Guide/MoodNextStepCard'
import { getServerSession } from '@/lib/get-server-session'
import { getExerciseFeedback } from '@/requests/exerciseFeedback'
import type { MoodRecordEntity } from '@/types/api-responses'

jest.mock('next-intl/server')
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/exerciseFeedback', () => ({ getExerciseFeedback: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/ds/components/SectionCard', () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const moodRecord: MoodRecordEntity = {
  id: 'qa-record',
  moodLevel: 3,
  stressLevel: 4,
  energyLevel: 2,
  focusLevel: 3,
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'qa-user' } })
  ;(getExerciseFeedback as jest.Mock).mockResolvedValue({ data: [] })
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string, vars?: { level?: number }) => {
    return vars ? `${key}:${vars.level}` : key
  })
})

describe('MoodNextStepCard', () => {
  it('explains the leading self-report and suggests a real existing activity', async () => {
    render(await MoodNextStepCard({ record: moodRecord }))

    expect(getTranslations).toHaveBeenCalledWith('components.ExercisesForRecovery.nextStep')
    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('observations.stress:4')).toBeInTheDocument()
    expect(screen.getByText('suggestions.breathing')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.breathing' })).toHaveAttribute('href', '/guide/breathing')
    expect(screen.getByText('limitNote')).toBeInTheDocument()
  })

  it('shows a calmer activity for a low mood', async () => {
    render(await MoodNextStepCard({ record: { ...moodRecord, stressLevel: 2, moodLevel: 1 } }))

    expect(screen.getByText('observations.mood:1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.calming' })).toHaveAttribute('href', '/guide/calming')
  })

  it('uses reported energy and focus when higher-priority signals are not elevated', async () => {
    const { unmount } = render(
      await MoodNextStepCard({ record: { ...moodRecord, stressLevel: 2, moodLevel: 3, energyLevel: 1 } })
    )
    expect(screen.getByText('observations.energy:1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.meditation' })).toHaveAttribute('href', '/guide/meditations')
    unmount()

    render(
      await MoodNextStepCard({
        record: { ...moodRecord, stressLevel: 2, moodLevel: 3, energyLevel: 3, focusLevel: 2 },
      })
    )
    expect(screen.getByText('observations.focus:2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.focus' })).toHaveAttribute(
      'href',
      '/mental-games/attention-sprint'
    )
  })

  it('allows an explicit one-tap override without changing the reported observation', async () => {
    render(await MoodNextStepCard({ record: moodRecord }))
    const breatheChoice = screen.getByRole('button', { name: 'options.breathing' })
    const focusChoice = screen.getByRole('button', { name: 'options.focus' })

    expect(breatheChoice).toHaveAttribute('aria-pressed', 'true')
    expect(focusChoice).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(focusChoice)

    expect(focusChoice).toHaveAttribute('aria-pressed', 'true')
    expect(breatheChoice).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('suggestions.focus')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.focus' })).toHaveAttribute(
      'href',
      '/mental-games/attention-sprint'
    )
    expect(screen.getByText('observations.stress:4')).toBeInTheDocument()
    expect(screen.getByText('userChoiceNote')).toBeInTheDocument()

    fireEvent.click(breatheChoice)
    expect(screen.queryByText('userChoiceNote')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.breathing' })).toHaveAttribute('href', '/guide/breathing')
  })

  it('uses saved voluntary feedback only for neutral check-ins, not elevated stress', async () => {
    ;(getExerciseFeedback as jest.Mock).mockResolvedValue({
      data: [
        { category: 'meditation', helpful: true },
        { category: 'focus', helpful: false },
      ],
    })
    const { unmount } = render(await MoodNextStepCard({ record: { ...moodRecord, stressLevel: 3, energyLevel: 3 } }))
    expect(screen.getByText('observations.preference:0')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.meditation' })).toHaveAttribute('href', '/guide/meditations')
    unmount()

    render(await MoodNextStepCard({ record: moodRecord }))
    expect(screen.getByText('observations.stress:4')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.breathing' })).toHaveAttribute('href', '/guide/breathing')
  })

  it('falls back to record-only rules when preferences are temporarily unavailable', async () => {
    ;(getExerciseFeedback as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })
    render(await MoodNextStepCard({ record: { ...moodRecord, stressLevel: 3, energyLevel: 3 } }))
    expect(screen.getByText('observations.general:0')).toBeInTheDocument()
  })

  it('does not invent a specific observation for invalid scores', async () => {
    render(
      await MoodNextStepCard({
        record: { ...moodRecord, stressLevel: -1, moodLevel: undefined, energyLevel: -1, focusLevel: 0 },
      })
    )
    expect(screen.getByText('observations.general:0')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.breathing' })).toHaveAttribute('href', '/guide/breathing')
    expect(screen.getByText('limitNote')).toBeInTheDocument()
  })
})
