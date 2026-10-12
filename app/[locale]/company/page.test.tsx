import { redirect } from 'next/navigation'

import CompanyDashboardPage from '@/app/[locale]/company/page'
import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`)
  }),
}))
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))

beforeEach(() => jest.clearAllMocks())

async function expectOnlyRedirect(user: object | null, locale: string, destination: string) {
  ;(getServerSession as jest.Mock).mockResolvedValue(user ? { user } : null)
  const target = `/${locale}${destination}`
  await expect(CompanyDashboardPage({ params: Promise.resolve({ locale }) })).rejects.toThrow(
    `NEXT_REDIRECT:${target}`
  )
  expect(redirect).toHaveBeenCalledTimes(1)
  expect(redirect).toHaveBeenCalledWith(target)
}

describe('Company dashboard role routing', () => {
  it('routes global administrators to platform administration', async () => {
    await expectOnlyRedirect({ role: 'admin' }, 'en', Routes.ADMIN)
  })

  it('never routes a platform admin with a company superuser role to B2B', async () => {
    await expectOnlyRedirect(
      { role: 'admin', companyId: 'company-1', companyRole: COMPANY_ROLES.SUPERUSER },
      'en',
      Routes.ADMIN
    )
  })

  it('never routes a platform admin with a manager role to B2B', async () => {
    await expectOnlyRedirect(
      { role: 'admin', companyId: 'company-1', companyRole: COMPANY_ROLES.MANAGER },
      'uk',
      Routes.ADMIN
    )
  })

  it('routes company superusers to their company admin workspace', async () => {
    await expectOnlyRedirect(
      { role: 'user', companyId: 'company-1', companyRole: COMPANY_ROLES.SUPERUSER },
      'uk',
      Routes.COMPANY_ADMIN
    )
  })

  it('routes company managers to their manager workspace', async () => {
    await expectOnlyRedirect(
      { role: 'user', companyId: 'company-1', companyRole: COMPANY_ROLES.MANAGER },
      'pl',
      Routes.COMPANY_MANAGER
    )
  })

  it('does not elevate ordinary company employees', async () => {
    await expectOnlyRedirect(
      { role: 'user', companyId: 'company-1', companyRole: COMPANY_ROLES.EMPLOYEE },
      'en',
      ''
    )
  })

  it('does not elevate authenticated users without a company membership', async () => {
    await expectOnlyRedirect({ role: 'user' }, 'uk', '')
  })

  it('redirects anonymous visitors without starting company routing', async () => {
    await expectOnlyRedirect(null, 'pl', '')
  })
})
