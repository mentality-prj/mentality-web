import { fireEvent, render, screen } from '@testing-library/react'

import { FeatureCardsSection } from './FeatureCardsSection'

const translations: Record<string, string> = {
  'Next.heading': 'What you can do next',
  'Next.subtitle': 'Choose any starting point.',
  'Next.mood.title': 'Mood check-in',
  'Next.mood.description': 'Record your mood.',
  'Next.diary.title': 'Private journal',
  'Next.diary.description': 'Keep your thoughts.',
  'Next.practice.title': 'More exercises',
  'Next.practice.description': 'Try breathing.',
  'Next.afterLogin': 'Available after sign-in',
  'Next.open': 'Open',
  'Next.closing': 'Your records are kept in your private space.',
  'Next.signup': 'Start for free',
  'Next.progressTitle': 'What helped you',
  'Next.progressDescription': 'Your voluntary ratings can be changed.',
  'Next.progressCta': 'See My Progress',
  'Hero.returnCta': 'My Day',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className, onClick }: { children: React.ReactNode; href: string; className?: string; onClick?: () => void }) => (
    <a href={href} className={className} onClick={onClick}>{children}</a>
  ),
}))

describe('Intent-based landing next actions', () => {
  it('sends unauthenticated visitors to sign-in only for private features', () => {
    render(<FeatureCardsSection />)
    expect(screen.getByRole('link', { name: /Mood check-in/ })).toHaveAttribute('href', '/auth')
    expect(screen.getByRole('link', { name: /Private journal/ })).toHaveAttribute('href', '/auth')
    expect(screen.getByRole('link', { name: /More exercises/ })).toHaveAttribute('href', '#try-now')
    expect(screen.getByRole('link', { name: 'Start for free' })).toHaveAttribute('href', '/auth')
    expect(screen.getByText('What helped you')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'See My Progress' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: /Mood check-in/ }))
    expect(window.sessionStorage.getItem('dzvin:landing-intent:v1')).toContain('"mood"')
    window.sessionStorage.clear()
  })

  it('links authenticated visitors to the actual features', () => {
    render(<FeatureCardsSection isAuthenticated />)
    expect(screen.getByRole('link', { name: /Mood check-in/ })).toHaveAttribute('href', '/mood-tracker')
    expect(screen.getByRole('link', { name: /Private journal/ })).toHaveAttribute('href', '/diary')
    expect(screen.getByRole('link', { name: /More exercises/ })).toHaveAttribute('href', '/guide/breathing')
    expect(screen.getByRole('link', { name: 'My Day' })).toHaveAttribute('href', '/my-day')
    expect(screen.getByRole('link', { name: 'See My Progress' })).toHaveAttribute('href', '/my-progress')
  })
})
