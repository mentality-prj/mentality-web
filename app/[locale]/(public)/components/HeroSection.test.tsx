import { render, screen } from '@testing-library/react'

import { HeroSection } from './HeroSection'

const translations: Record<string, string> = {
  'Hero.title': 'Here when you need support',
  'Hero.subtitle': 'Track your mood or write in a private journal',
  'Hero.cta': 'Start for free',
  'Hero.returnCta': 'Open My Day',
  'Hero.path.heading': 'Your pace, your support',
  'Hero.path.mood': 'Notice your mood and energy',
  'Hero.path.diary': 'Write in your journal',
  'Hero.path.support': 'Try breathing or calming',
  'Hero.path.note': 'Not a diagnosis or a substitute for professional support',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('HeroSection B2C first-use copy', () => {
  it('offers three real self-support actions instead of fake testimonials', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1, name: 'Here when you need support' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Your pace, your support' })).toBeInTheDocument()
    expect(screen.getByRole('list').querySelectorAll('li')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Start for free' })).toHaveAttribute('href', '/auth')
    expect(screen.getByText(/Not a diagnosis/)).toBeInTheDocument()
    expect(screen.queryByText('725+')).not.toBeInTheDocument()
  })
})


describe('returning visitor landing actions', () => {
  it('links a validated returning user to My Day and existing self-support screens', () => {
    render(<HeroSection isAuthenticated />)

    expect(screen.getByRole('link', { name: 'Open My Day' })).toHaveAttribute('href', '/my-day')
    expect(screen.getByRole('link', { name: 'Notice your mood and energy' })).toHaveAttribute(
      'href',
      '/mood-tracker'
    )
    expect(screen.getByRole('link', { name: 'Write in your journal' })).toHaveAttribute('href', '/diary')
    expect(screen.getByRole('link', { name: 'Try breathing or calming' })).toHaveAttribute(
      'href',
      '/guide/breathing'
    )
    expect(screen.queryByRole('link', { name: 'Start for free' })).not.toBeInTheDocument()
  })
})
