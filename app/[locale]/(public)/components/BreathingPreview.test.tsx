import { act, fireEvent, render, screen } from '@testing-library/react'

import { BreathingPreview } from './BreathingPreview'

const translations: Record<string, string> = {
  heading: 'Breathing exercise',
  duration: '30 seconds',
  withoutAccount: 'No sign-in',
  ready: 'Ready',
  inhale: 'Breathe in',
  exhale: 'Breathe out',
  done: 'Complete',
  start: 'Start',
  stop: 'Stop',
  restart: 'Try again',
  next: 'Continue in Dzvin',
  progress: 'Exercise progress',
  private: 'Nothing is saved.',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

describe('Public breathing preview', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('does not require login to begin and can be stopped without saving', () => {
    render(<BreathingPreview />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByText('Nothing is saved.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Breathe in')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Continue in Dzvin' })).not.toBeInTheDocument()
  })

  it('runs three 4-second inhale / 6-second exhale cycles then offers signup', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-10-21T10:00:00.000Z'))
    render(<BreathingPreview />)
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    act(() => {
      jest.advanceTimersByTime(5_000)
    })
    expect(screen.getByText('Breathe out')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(25_000)
    })
    expect(screen.getByText('Complete')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '30')
    expect(screen.getByRole('link', { name: 'Continue in Dzvin' })).toHaveAttribute('href', '/auth')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('offers My Day to signed-in visitors after completion', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-10-21T10:00:00.000Z'))
    render(<BreathingPreview isAuthenticated />)
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    act(() => {
      jest.advanceTimersByTime(30_000)
    })
    expect(screen.getByRole('link', { name: 'Continue in Dzvin' })).toHaveAttribute('href', '/my-day')
  })
})
