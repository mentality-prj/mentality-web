import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { DailyHabitsCard } from '@/components/features/MyDay/DailyHabitsCard'
import { useAuth } from '@/context/AuthProvider'
import { checkDailyHabit, chooseDailyHabit, getDailyHabits, removeDailyHabit } from '@/requests/dailyHabits'
import { getLocalDayKey, getVerifiedBrowserTimeZone } from '@/utils/timeZone'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/utils/timeZone', () => ({
  getLocalDayKey: jest.fn(),
  getVerifiedBrowserTimeZone: jest.fn(),
}))
jest.mock('@/requests/dailyHabits', () => ({
  DAILY_HABIT_KINDS: ['breathing', 'movement', 'journaling', 'screenBreak'],
  getDailyHabits: jest.fn(),
  chooseDailyHabit: jest.fn(),
  checkDailyHabit: jest.fn(),
  removeDailyHabit: jest.fn(),
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))
jest.mock('@/ds/components/SectionCard', () => ({
  SectionCard: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
}))

const session = { user: { id: 'user-1' } }

beforeEach(() => {
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  ;(useAuth as jest.Mock).mockReturnValue({ session, status: 'authenticated' })
  ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Warsaw')
  ;(getLocalDayKey as jest.Mock).mockReturnValue('2026-10-20')
  ;(getDailyHabits as jest.Mock).mockResolvedValue({ data: [] })
})

describe('My Day voluntary habits mobile UI', () => {
  it('uses four compact, consistently rounded rows with accessible add actions', async () => {
    const { container } = render(<DailyHabitsCard />)
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'choose' })).toHaveLength(4))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(4)
    items.forEach((item) => {
      expect(item).toHaveClass('rounded-[14px]')
      expect(item).not.toHaveClass('rounded-xl')
      expect(within(item).getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
    expect(container.querySelector('section > div')).toHaveClass('!rounded-[20px]')
    expect(screen.getByText('noPressure')).toBeInTheDocument()
  })

  it('keeps the three-step workflow functional: add, complete, undo', async () => {
    ;(chooseDailyHabit as jest.Mock).mockResolvedValue({ data: { kind: 'breathing', doneToday: false } })
    ;(checkDailyHabit as jest.Mock)
      .mockResolvedValueOnce({ data: { kind: 'breathing', doneToday: true } })
      .mockResolvedValueOnce({ data: { kind: 'breathing', doneToday: false } })
    render(<DailyHabitsCard />)
    await screen.findAllByRole('button', { name: 'choose' })
    fireEvent.click(screen.getAllByRole('button', { name: 'choose' })[0])
    await waitFor(() => expect(screen.getByRole('button', { name: 'markToday' })).toBeInTheDocument())
    expect(chooseDailyHabit).toHaveBeenCalledWith(session, 'breathing', 'Europe/Warsaw')
    expect(screen.getByRole('link', { name: 'openActivity' })).toHaveAttribute('href', '/guide/breathing')
    fireEvent.click(screen.getByRole('button', { name: 'markToday' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'undo' })).toHaveAttribute('aria-pressed', 'true'))
    fireEvent.click(screen.getByRole('button', { name: 'undo' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'markToday' })).toHaveAttribute('aria-pressed', 'false'))
    expect(checkDailyHabit).toHaveBeenCalledWith(session, 'breathing', false, 'Europe/Warsaw')
  })

  it('removes a habit only after the server acknowledges the change', async () => {
    ;(getDailyHabits as jest.Mock).mockResolvedValue({ data: [{ kind: 'journaling', doneToday: false }] })
    ;(removeDailyHabit as jest.Mock).mockResolvedValue({ data: { kind: 'journaling', selected: false } })
    render(<DailyHabitsCard />)
    await screen.findByRole('button', { name: 'remove' })
    expect(screen.getByRole('link', { name: 'openActivity' })).toHaveAttribute('href', '/diary')
    fireEvent.click(screen.getByRole('button', { name: 'remove' }))
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'choose' })).toHaveLength(4))
    expect(removeDailyHabit).toHaveBeenCalledWith(session, 'journaling')
  })

  it('offers a retry on API failure without exposing unverified actions', async () => {
    ;(getDailyHabits as jest.Mock)
      .mockResolvedValueOnce({ error: 'Unavailable' })
      .mockResolvedValueOnce({ data: [] })
    render(<DailyHabitsCard />)
    await screen.findByRole('alert')
    expect(screen.queryByRole('button', { name: 'choose' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'retry' }))
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'choose' })).toHaveLength(4))
  })

  it('never provides habit actions when the current local day is unknown', async () => {
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue(null)
    render(<DailyHabitsCard />)
    await screen.findByText('unknownDay')
    expect(screen.queryByRole('button', { name: 'choose' })).not.toBeInTheDocument()
    expect(chooseDailyHabit).not.toHaveBeenCalled()
  })
})
