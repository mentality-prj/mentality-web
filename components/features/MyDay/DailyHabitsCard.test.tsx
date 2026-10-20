import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { DailyHabitsCard } from '@/components/features/MyDay/DailyHabitsCard'
import { useAuth } from '@/context/AuthProvider'
import { checkDailyHabit, chooseDailyHabit, removeDailyHabit } from '@/requests/dailyHabits'
import { getLocalDayKey } from '@/utils/timeZone'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/utils/timeZone', () => ({ getLocalDayKey: jest.fn() }))
jest.mock('@/requests/dailyHabits', () => ({
  DAILY_HABIT_KINDS: ['breathing', 'movement', 'journaling', 'screenBreak'],
  chooseDailyHabit: jest.fn(),
  checkDailyHabit: jest.fn(),
  removeDailyHabit: jest.fn(),
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/ds/components/SectionCard', () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const session = { user: { id: 'verified-user' } }
const refresh = jest.fn()
const base = {
  initialHabits: [] as Array<{ kind: 'breathing' | 'movement' | 'journaling' | 'screenBreak'; doneToday: boolean }>,
  timeZone: 'Europe/Warsaw',
  initialDayKey: '2026-10-20',
  failed: false,
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  ;(useAuth as jest.Mock).mockReturnValue({ session })
  ;(useRouter as jest.Mock).mockReturnValue({ refresh })
  ;(getLocalDayKey as jest.Mock).mockReturnValue('2026-10-20')
})

describe('DailyHabitsCard: no-pressure daily routine', () => {
  it('offers four unselected actions without deadlines or assumed completions', () => {
    render(<DailyHabitsCard {...base} />)
    expect(screen.getAllByRole('button', { name: 'choose' })).toHaveLength(4)
    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('noPressure')).toBeInTheDocument()
    expect(screen.queryByText('doneToday')).not.toBeInTheDocument()
    expect(chooseDailyHabit).not.toHaveBeenCalled()
    expect(checkDailyHabit).not.toHaveBeenCalled()
  })

  it('adds a habit after an acknowledged server update, then marks it today', async () => {
    ;(chooseDailyHabit as jest.Mock).mockResolvedValue({
      data: { kind: 'breathing', doneToday: false },
    })
    ;(checkDailyHabit as jest.Mock).mockResolvedValue({
      data: { kind: 'breathing', doneToday: true },
    })
    render(<DailyHabitsCard {...base} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'choose' })[0])
    await waitFor(() => expect(screen.getByRole('button', { name: 'markToday' })).toBeInTheDocument())
    expect(chooseDailyHabit).toHaveBeenCalledWith(session, 'breathing', 'Europe/Warsaw')
    expect(screen.getByRole('link', { name: 'openActivity' })).toHaveAttribute('href', '/guide/breathing')

    fireEvent.click(screen.getByRole('button', { name: 'markToday' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'undo' })).toHaveAttribute('aria-pressed', 'true'))
    expect(checkDailyHabit).toHaveBeenCalledWith(session, 'breathing', true, 'Europe/Warsaw')
    expect(screen.getByText('doneToday')).toBeInTheDocument()
  })

  it('allows undo and removal without penalties or an inferred streak', async () => {
    ;(checkDailyHabit as jest.Mock).mockResolvedValue({
      data: { kind: 'journaling', doneToday: false },
    })
    ;(removeDailyHabit as jest.Mock).mockResolvedValue({
      data: { kind: 'journaling', selected: false },
    })
    render(<DailyHabitsCard {...base} initialHabits={[{ kind: 'journaling', doneToday: true }]} />)
    expect(screen.getByRole('link', { name: 'openActivity' })).toHaveAttribute('href', '/diary')
    fireEvent.click(screen.getByRole('button', { name: 'undo' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'markToday' })).toBeInTheDocument())
    expect(checkDailyHabit).toHaveBeenCalledWith(session, 'journaling', false, 'Europe/Warsaw')

    fireEvent.click(screen.getByRole('button', { name: 'remove' }))
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'choose' })).toHaveLength(4))
    expect(removeDailyHabit).toHaveBeenCalledWith(session, 'journaling')
  })

  it('shows API errors and preserves a previously saved check', async () => {
    ;(checkDailyHabit as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })
    render(<DailyHabitsCard {...base} initialHabits={[{ kind: 'breathing', doneToday: true }]} />)
    fireEvent.click(screen.getByRole('button', { name: 'undo' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('failed'))
    expect(screen.getByRole('button', { name: 'undo' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('doneToday')).toBeInTheDocument()
  })

  it('never records an activity when user timezone is unverified', () => {
    render(<DailyHabitsCard {...base} timeZone={null} initialDayKey={null} />)
    expect(screen.getByText('unknownDay')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'choose' })).not.toBeInTheDocument()
    expect(chooseDailyHabit).not.toHaveBeenCalled()
  })

  it('distinguishes failed load from a valid empty selection', () => {
    render(<DailyHabitsCard {...base} failed />)
    expect(screen.getByRole('alert')).toHaveTextContent('loadError')
    expect(screen.queryByRole('button', { name: 'choose' })).not.toBeInTheDocument()
  })

  it('refuses saving without a verified session', () => {
    ;(useAuth as jest.Mock).mockReturnValue({ session: null })
    render(<DailyHabitsCard {...base} />)
    fireEvent.click(screen.getAllByRole('button', { name: 'choose' })[0])
    expect(screen.getByRole('status')).toHaveTextContent('login')
    expect(chooseDailyHabit).not.toHaveBeenCalled()
  })

  it('refreshes before a mutation when a PWA tab crosses the local midnight boundary', () => {
    ;(getLocalDayKey as jest.Mock).mockReturnValue('2026-10-21')
    render(<DailyHabitsCard {...base} />)
    fireEvent.click(screen.getAllByRole('button', { name: 'choose' })[0])
    expect(refresh).toHaveBeenCalled()
    expect(chooseDailyHabit).not.toHaveBeenCalled()
  })
})
