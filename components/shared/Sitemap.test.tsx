import { render, screen } from '@testing-library/react'

import Sitemap from '@/components/shared/Sitemap'
import { useAuth } from '@/context/AuthProvider'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

function renderForUser(user: Record<string, unknown> | null) {
  ;(useAuth as jest.Mock).mockReturnValue({
    session: user ? { user } : null,
    status: user ? 'authenticated' : 'unauthenticated',
  })
  return render(<Sitemap />)
}

describe('Sitemap B2B navigation authorization', () => {
  beforeEach(() => jest.clearAllMocks())

  it('does not show B2B navigation to anonymous users', () => {
    renderForUser(null)
    expect(screen.queryByText('sectionB2B')).not.toBeInTheDocument()
  })

  it.each([COMPANY_ROLES.SUPERUSER, COMPANY_ROLES.MANAGER])(
    'does not show B2B navigation for %s without a verified companyId',
    (companyRole) => {
      renderForUser({ role: 'user', companyRole })
      expect(screen.queryByText('sectionB2B')).not.toBeInTheDocument()
    }
  )

  it('rejects empty companyId even with a valid role', () => {
    renderForUser({ role: 'user', companyId: '', companyRole: COMPANY_ROLES.SUPERUSER })
    expect(screen.queryByText('sectionB2B')).not.toBeInTheDocument()
  })

  it('does not show B2B navigation when companyId has no company role', () => {
    renderForUser({ role: 'user', companyId: 'company-1' })
    expect(screen.queryByText('sectionB2B')).not.toBeInTheDocument()
  })

  it('does not show B2B navigation to platform admins even with company membership', () => {
    renderForUser({ role: 'admin', companyId: 'company-1', companyRole: COMPANY_ROLES.SUPERUSER })
    expect(screen.queryByText('sectionB2B')).not.toBeInTheDocument()
  })

  it('shows superuser links for a verified company membership', () => {
    renderForUser({ role: 'user', companyId: 'company-1', companyRole: COMPANY_ROLES.SUPERUSER })
    expect(screen.getByText('sectionB2B')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'company-superuser' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'manager' })).not.toBeInTheDocument()
  })

  it('shows manager links for a verified company membership', () => {
    renderForUser({ role: 'user', companyId: 'company-1', companyRole: COMPANY_ROLES.MANAGER })
    expect(screen.getByText('sectionB2B')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'manager' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'company-superuser' })).not.toBeInTheDocument()
  })

  it('removes B2B links when the selected company disappears after a session change', () => {
    const { rerender } = renderForUser({
      role: 'user',
      companyId: 'company-1',
      companyRole: COMPANY_ROLES.MANAGER,
    })
    expect(screen.getByText('sectionB2B')).toBeInTheDocument()
    ;(useAuth as jest.Mock).mockReturnValue({
      status: 'authenticated',
      session: { user: { role: 'user', companyRole: COMPANY_ROLES.MANAGER } },
    })
    rerender(<Sitemap />)
    expect(screen.queryByText('sectionB2B')).not.toBeInTheDocument()
  })
})
