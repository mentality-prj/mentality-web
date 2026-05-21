import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import CompanyDashboardPage from '@/app/[locale]/company/page'
import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('next-intl/server')
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))

jest.mock('@/components/features/Landing', () => ({
  LandingFooter: () => <div data-testid="landing-footer" />,
}))

jest.mock('@/components/Layout/Header/CompanyHeader', () => ({
  CompanyHeader: () => <div data-testid="company-header" />,
}))

jest.mock('@/components/Layout/mainVariants', () => ({
  mainVariants: () => '',
}))

jest.mock('@/ds/components/PageTitle', () => ({
  PageTitle: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  ),
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

jest.mock('@/lib/utils', () => ({
  cn: (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' '),
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => {
    switch (key) {
      case 'title':
        return 'Company Dashboard'
      case 'subtitle':
        return 'Company workspace subtitle'
      case 'description':
        return 'Company workspace description'
      case 'adminPanel':
        return 'Admin Panel'
      case 'adminDescription':
        return 'Admin description'
      case 'managerPanel':
        return 'Manager Panel'
      case 'managerDescription':
        return 'Manager description'
      case 'serviceAdminEyebrow':
        return 'Service admin dashboard'
      case 'serviceAdminTitle':
        return 'Company creation moved'
      case 'serviceAdminDescription':
        return 'Creation policy description'
      case 'serviceAdminNoteTitle':
        return 'What changed'
      case 'serviceAdminNoteDescription':
        return 'Creation is no longer available here'
      case 'serviceAdminLink':
        return 'Open service admin dashboard'
      default:
        return key
    }
  })
})

describe('Company dashboard page', () => {
  it('renders informational company navigation for system admins without a create-company button', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: {
        role: 'admin',
      },
    })

    render(await CompanyDashboardPage({ params: Promise.resolve({ locale: 'en' }) }))

    expect(screen.getByRole('heading', { name: 'Company Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Company workspace description')).toBeInTheDocument()
    expect(screen.getByText('Admin description')).toBeInTheDocument()
    expect(screen.getByText('Manager description')).toBeInTheDocument()
    expect(screen.getByText('Open service admin dashboard')).toHaveAttribute('href', Routes.ADMIN)
    expect(screen.queryByText('Add Company')).not.toBeInTheDocument()
  })

  it('redirects company superusers to the admin workspace', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: {
        role: 'user',
        companyRole: COMPANY_ROLES.SUPERUSER,
      },
    })

    await CompanyDashboardPage({ params: Promise.resolve({ locale: 'uk' }) })

    expect(redirect).toHaveBeenCalledWith(`/uk${Routes.COMPANY_ADMIN}`)
  })
})
