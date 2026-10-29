import { render, screen } from '@testing-library/react'

import { LegacyFeatureCardsSection } from './LegacyFeatureCardsSection'
import { LegacyHeroSection } from './LegacyHeroSection'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => namespace + '.' + key,
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

describe('restored original landing design', () => {
  it('keeps the logo-anchored ring background, volume CTA and avatars without an unsourced metric', () => {
    const { container } = render(<LegacyHeroSection />)
    expect(container.querySelector('section.hero-zen')).toBeInTheDocument()
    expect(container.querySelectorAll('h1')).toHaveLength(0)
    expect(screen.getByRole('heading', { level: 2, name: 'pages.Landing.Legacy.Hero.title' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'pages.Landing.Legacy.Hero.cta' })).toHaveAttribute('href', '/auth')
    expect(screen.getByRole('link', { name: 'pages.Landing.Legacy.Hero.card.cta' })).toHaveAttribute(
      'href',
      '/services'
    )
    expect(container.textContent).not.toContain('725')
    expect(container.textContent).not.toContain('testimonial.metric')
  })

  it('renders the three illustrated feature cards', () => {
    render(<LegacyFeatureCardsSection />)
    expect(screen.getByText('pages.Landing.Features.interactivity.title')).toBeInTheDocument()
    expect(screen.getByText('pages.Landing.Features.support.title')).toBeInTheDocument()
    expect(screen.getByText('pages.Landing.Features.ai.title')).toBeInTheDocument()
  })
})
