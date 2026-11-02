import { redirect } from 'next/navigation'

import CompanyLayout from '@/app/[locale]/company/layout'
import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`)
  }),
}))
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))

beforeEach(() => {
  delete process.env.DZVIN_B2C_ONLY_RELEASE
  jest.clearAllMocks()
})
afterAll(() => {
  delete process.env.DZVIN_B2C_ONLY_RELEASE
})

const params = Promise.resolve({ locale: 'en' })
const renderLayout = (user: object | null) => {
  ;(getServerSession as jest.Mock).mockResolvedValue(user ? { user } : null)
  return CompanyLayout({ children: 'B2B workspace', params })
}

async function expectLayoutRedirect(user: object | null, destination: string) {
  const target = `/en${destination}`
  await expect(renderLayout(user)).rejects.toThrow(`NEXT_REDIRECT:${target}`)
  expect(redirect).toHaveBeenCalledTimes(1)
  expect(redirect).toHaveBeenCalledWith(target)
}

describe('company layout access boundary', () => {
  it('redirects company members away in B2C-only deployment', async () => {
    process.env.DZVIN_B2C_ONLY_RELEASE = 'true'
    await expectLayoutRedirect({ role: 'user', companyId: 'company-1', companyRole: COMPANY_ROLES.MANAGER }, '')
  })
  it('redirects unauthenticated visitors to login', async () => {
    await expectLayoutRedirect(null, '/auth')
  })

  it('denies platform administrator without a company role', async () => {
    await expectLayoutRedirect({ role: 'admin' }, Routes.ADMIN)
  })

  it('denies platform administrator even with company superuser membership', async () => {
    await expectLayoutRedirect(
      { role: 'admin', companyId: 'company-1', companyRole: COMPANY_ROLES.SUPERUSER },
      Routes.ADMIN
    )
  })

  it('denies platform administrator even with company manager membership', async () => {
    await expectLayoutRedirect(
      { role: 'admin', companyId: 'company-1', companyRole: COMPANY_ROLES.MANAGER },
      Routes.ADMIN
    )
  })

  it('denies users without a company membership', async () => {
    await expectLayoutRedirect({ role: 'user' }, '/select-company')
  })

  it('allows company managers with their verified company role', async () => {
    const result = await renderLayout({
      role: 'user',
      companyId: 'company-1',
      companyRole: COMPANY_ROLES.MANAGER,
    })
    expect(result.props.children).toBe('B2B workspace')
    expect(redirect).not.toHaveBeenCalled()
  })

  it('allows company employees into base company layout only', async () => {
    const result = await renderLayout({
      role: 'user',
      companyId: 'company-1',
      companyRole: COMPANY_ROLES.EMPLOYEE,
    })
    expect(result.props.children).toBe('B2B workspace')
    expect(redirect).not.toHaveBeenCalled()
  })
})
