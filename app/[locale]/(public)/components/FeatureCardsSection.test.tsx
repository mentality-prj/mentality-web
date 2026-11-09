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
  Link: ({
    children,
    href,
    className,
    onClick,
  }: {
    children: React.ReactNode
    href: string
    className?: string
    onClick?: () => void
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}))

describe('Intent-based landing next actions', () => {
  it('sends unauthenticated visitors to sign-in only for private features', () => {
    render(<FeatureCardsSection />)
    expect(sc¶»§q«^