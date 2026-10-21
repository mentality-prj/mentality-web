import { render, screen, within } from '@testing-library/react'

import { PlatformHeroSection } from './PlatformHeroSection'
import { PlatformProductsSection } from './PlatformProductsSection'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => namespace + '.' + key,
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

describe('Dzvin multi-product landing priorities', () => {
  it('puts the enterprise offer first with a real public sales contact route', () => {
    const { container } = render(<PlatformHeroSection />)
    expect(screen.getByRole('heading', { level: 1, name: 'pages.Landing.Platform.title' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.primaryCta/ })).toHaveAttribute('href', '/contacts')
    expect(screen.getByRole('link', { name: /pages.Landing.Platform.secondaryCta/ })).toHaveAttribute('href', '/services#b2b')
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('shows B2B first and bigger, B2C and R&D with distinct destinations', () => {
    const { container } = render(<PlatformProductsSection />)
    const cards = [...container.querySelectorAll('article')]
    expect(cards).toHaveLength(3)
    expect(within(cards[0]).getByText('pages.Landing.Products.b2b.title')).toBeInTheDocument()
    expect(cards[0]).toHaveClass('lg:col-span-2')
    expect(within(cards[1]).getByText('pages.Landing.Products.b2c.title')).toBeInTheDocument()
    expect(within(cards[2]).getByText('pages.Landing.Products.rd.title')).toBeInTheDocument()
    expect(within(cards[0]).getByRole('link')).toHaveAttribute('href', '/services#b2b')
    expect(within(cards[1]).getByRole('link')).toHaveAttribute('href', '#b2c-experience')
    expect(within(cards[2]).getByRole('link')).toHaveAttribute('href', '/services#rd')
  })
})
