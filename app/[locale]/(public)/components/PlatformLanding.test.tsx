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
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.primaryCta/ })).toHaveAttribute('href', '#b2c-experience')
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.secondaryCta/ })).toHaveAttribute('href', '#products')
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.businessCta/ })).toHaveAttribute('href', '/business')
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(screen.queryByText('DZVIN / B2B')).not.toBeInTheDocument()
  })

  it('offers My Day to an authenticated visitor', () => {
    render(<PlatformHeroSection isAuthenticated />)
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.returnCta/ })).toHaveAttribute('href', '/my-day')
  })

  it('presents B2C first and largest, with a real enterprise contact CTA and research path', () => {
    const { container } = render(<PlatformProductsSection />)
    const cards = [...container.querySelectorAll('article')]
    expect(cards).toHaveLength(3)
    expect(within(cards[0]).getByText('pages.Landing.Products.b2c.title')).toBeInTheDocument()
    expect(cards[0]).toHaveClass('lg:col-span-5')
    expect(within(cards[1]).getByText('pages.Landing.Products.b2b.title')).toBeInTheDocument()
    expect(cards[1]).toHaveClass('lg:col-span-4')
    expect(within(cards[2]).getByText('pages.Landing.Products.rd.title')).toBeInTheDocument()
    expect(cards[2]).toHaveClass('lg:col-span-3')
    expect(within(cards[0]).getByRole('link')).toHaveAttribute('href', '#b2c-experience')
    expect(within(cards[1]).getByRole('link', { name: /pages.Landing.Products.b2b.cta/ })).toHaveAttribute('href', '/business#business-inquiry')
    expect(within(cards[1]).getByRole('link', { name: /pages.Landing.Products.b2b.detailsCta/ })).toHaveAttribute('href', '/business')
    expect(within(cards[2]).getByRole('link')).toHaveAttribute('href', '/research-partners')
  })
  it('provides a dedicated B2B pilot entry after the personal journey', () => {
    render(<BusinessInvitationSection />)
    expect(screen.getByRole('heading', { name: 'pages.Landing.BusinessInvitation.title' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pages.Landing.BusinessInvitation.cta/ })).toHaveAttribute('href', '/business')
  })

})
