import { fireEvent, render, screen } from '@testing-library/react'

import CookieConsent from './CookieConsent'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

describe('CookieConsent', () => {
  beforeEach(() => {
    document.cookie = 'cookie_consent=; Max-Age=0; Path=/'
  })

  it('shows a compact notice with the policy link and collapsed details', () => {
    render(<CookieConsent />)
    expect(screen.getByRole('region', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('short', { exact: false })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'policy' })).toHaveAttribute('href', '/cookies')
    expect(screen.getByText('details').closest('details')).not.toHaveAttribute('open')
  })

  it('remembers consent and hides the notice', () => {
    render(<CookieConsent />)
    fireEvent.click(screen.getByRole('button', { name: 'accept' }))
    expect(screen.queryByRole('region', { name: 'title' })).not.toBeInTheDocument()
    expect(document.cookie).toContain('cookie_consent=1')
  })

  it('stays hidden once consent was given', () => {
    document.cookie = 'cookie_consent=1; Path=/'
    render(<CookieConsent />)
    expect(screen.queryByRole('region', { name: 'title' })).not.toBeInTheDocument()
  })
})
