import { render, screen } from '@testing-library/react'

import { HowItWorksSection } from './HowItWorksSection'

const translations: Record<string, string> = {
  'HowItWorks.title': 'How it works',
  'HowItWorks.subtitle': 'No rush',
  'HowItWorks.steps.register': 'Sign in — to get started',
  'HowItWorks.steps.choose': 'Choose — a small action',
  'HowItWorks.steps.receive': 'Return — when useful',
  'HowItWorks.cta': 'Start for free',
  'Hero.returnCta': 'Open My Day',
  'ReduceStress.title': 'Support',
  'ReduceStress.subtitle': 'On your terms',
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
jest.mock('./HighlightInfoCard', () => ({
  HighlightInfoCard: () => <div data-testid="highlight-card" />,
}))

describe('HowItWorksSection entry point', () => {
  it('sends anonymous visitors to sign-in', () => {
    render(<HowItWorksSection />)
    expect(screen.getByRole('link', { name: 'Start for free' })).toHaveAttribute('href', '/auth')
  })

  it('lets authenticated visitors enter My Day directly', () => {
    render(<HowItWorksSection isAuthenticated />)
    expect(screen.getByRole('link', { name: 'Open My Day' })).toHaveAttribute('href', '/my-day')
    expect(screen.queryByRole('link', { name: 'Start for free' })).not.toBeInTheDocument()
  })
})
