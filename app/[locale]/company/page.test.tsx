import { redirect } from 'next/navigation'

import CompanyDashboardPage from '@/app/[locale]/company/page'
import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))

beforeEach(() => jest.clearAllMocks())

describe('Company dashboard role routing', () => {
  it('routes system administrators to platform administration only', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'admin' },
    })
    await CompanyDashboardPage({ params: Promise.resolve({ locale: 'en' }) })
    expect(redirect).toHaveBeenCalledWith(`/en${Routes.ADMIN}`)
    expect(redirect).not.toHaveBeenCalledWith(`/en${Routes.COMPANY_ADMIN}`)
  })

  it('routes company superusers to their company admin workspace', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'user', companyRole: COMPANY_ROLES.SUPERUSER },
    })
    await CompanyDashboardPage({ params: Promise.resolve({ locale: 'uk' }) })
    expect(redirect).toHaveBeenCalledWith(`/uk${Routes.COMPANY_ADMIN}`)
  })

  it('routes company managers to their manager workspace', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'user', companyRole: COMPANY_ROLES.MANAGER },
    })
    await CompanyDashboardPage({ params: Promise.resolve({ locale: 'pl' }) })
    expect(redirect).toHaveBeenCalledWith(`/pl${Routes.COMPANY_MANAGER}`)
  })
})
