import { render, screen } from '@testing-library/react'

import { HeroSection } from './HeroSection'

const translations: Record<string, string> = {
  'Hero.title': 'Here when you need it',
  'Hero.subtitle': 'Try a short breathing exercise without signing in.',
  'Hero.returnTitle': 'Your Dzvin',
  'Hero.returnSubtitle': 'Return to your entries.',
  'Hero.tryCta': 'Try 30 seconds',
  'Hero.cta': 'Create an account',
  'Hero.returnCta': 'My Day',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('./BreathingPreview', () => ({
  BreathingPreview: () => <div data-testid="breathing-preview" />,
}))

describe('Landing conversion hero', () => {
  it('offers a working no-account preview first and a separate signup action', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1, name: 'Here when you need it' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Try 30 seconds/ })).toHaveAttribute('href', '#try-now')
    expect(screen.getByRole('link', { name: /Create an account/ })).toHaveAttribute('href', '/auth')
    expect(screen.getByTestId('breathing-preview')).toBeInTheDocument()
    expect(screen.queryByText('725+')).not.toBeInTheDocument()
  })

  it('sends returning users to My Day rather than the signup screen', () => {
    render(<HeroSection isAuthenticated />)
    expect(screen.getByRole('heading', { level: 1, name: 'Your Dzvin' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /My Day/ })).toHaveAttribute('href', '/my-day')
    expect(screen.queryByRole('link', { name: /Create an account/ })).not.toBeInTheDocument()
  })
})
