import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { performCompanyAdminRequest } from '@/requests/genericFetch'
import type { CustomSession } from '@/types/auth'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('@/helpers/api-request-with-auth')
jest.mock('@/lib/logger', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}))

const companyId = '507f1f77bcf86cd799439011'
const url = `https://api.example.test/companies/${companyId}/groups`
const verifiedSession: CustomSession = {
  user: {
    id: 'user-1',
    name: 'Company Owner',
    email: 'owner@example.test',
    role: 'user',
    companyId,
    companyRole: COMPANY_ROLES.SUPERUSER,
  },
  OAuthToken: 'verified-bearer',
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [] })
})

describe('performCompanyAdminRequest', () => {
  it('forwards a verified company superuser request', async () => {
    await expect(performCompanyAdminRequest(verifiedSession, companyId, url)).resolves.toEqual({
      data: [],
      headers: undefined,
    })
    expect(apiRequestWithAuth).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['missing session', null],
    ['unscoped session', { ...verifiedSession, user: { ...verifiedSession.user, companyId: undefined } }],
    ['other company', { ...verifiedSession, user: { ...verifiedSession.user, companyId: 'other-tenant' } }],
    ['manager', { ...verifiedSession, user: { ...verifiedSession.user, companyRole: COMPANY_ROLES.MANAGER } }],
    ['employee', { ...verifiedSession, user: { ...verifiedSession.user, companyRole: COMPANY_ROLES.EMPLOYEE } }],
    ['platform admin with company role', { ...verifiedSession, user: { ...verifiedSession.user, role: 'admin' as const } }],
  ])('denies %s before the API transport', async (_label, session) => {
    await expect(performCompanyAdminRequest(session as CustomSession | null, companyId, url)).resolves.toEqual({
      error: 'Unauthorized: company administrator role required',
    })
    expect(apiRequestWithAuth).not.toHaveBeenCalled()
  })

  it('rejects an arbitrary tenant ID even for a verified company superuser', async () => {
    await expect(performCompanyAdminRequest(verifiedSession, 'other-tenant', url)).resolves.toHaveProperty('error')
    expect(apiRequestWithAuth).not.toHaveBeenCalled()
  })

  it('preserves the HTTP method and request body', async () => {
    await performCompanyAdminRequest(verifiedSession, companyId, url, { method: 'POST', body: { name: 'New group' } })
    expect(apiRequestWithAuth).toHaveBeenCalledWith(
      verifiedSession,
      url,
      { method: 'POST', body: { name: 'New group' } },
      { autoSignOutOn401: false }
    )
  })
})
