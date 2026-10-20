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
    expect(scre...[truncated]