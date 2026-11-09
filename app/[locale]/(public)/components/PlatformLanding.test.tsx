import { render, screen, within } from '@testing-library/react'

import { BusinessInvitationSection } from './BusinessInvitationSection'
import { PlatformHeroSection } from './PlatformHeroSection'
import { PlatformProductsSection } from './PlatformProductsSection'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => namespace + '.' + key,
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

describe('Dzvin people-first platform landing', () => {
  it('introduces the personal product before enterprise services', () => {
    const { container } = render(<PlatformHeroSection />)
    expect(screen.getByRole('heading', { level: 1, name: 'pages.Landing.Platform.title' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.primaryCta/ })).toHaveAttribute(
      'href',
      '#b2c-experience'
    )
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.secondaryCta/ })).toHaveAttribute(
      'href',
      '#products'
    )
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.businessCta/ })).toHaveAttribute(
      'href',
      '/contacts?source=landing&intent=demo&segment=teams'
    )
    expect(
      screen.getByRole('link', { name: /pages.Landing.Platform.businessCta/ }).querySelectorAll('svg')
    ).toHaveLength(2)
    expect(container.querySelectorAll('h1')).toHaveLength¶»§q«^