import { COMPANY_ADMIN_ENDPOINTS, INVITE_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import {
  cancelInvite,
  cancelInviteAdmin,
  createInvite,
  createInviteAdmin,
  getInvites,
  getInvitesAdmin,
  resendInvite,
  resendInviteAdmin,
} from '@/requests/invites'
import { CustomSession } from '@/types/auth'
import { CreateInviteDto, InviteEntity } from '@/types/company'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('@/requests/genericFetch')
jest.mock('@/lib/http', () => ({
  extractPaginationTotal: jest.fn((_headers: unknown, fallback: number) => fallback),
}))
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}))

const mockSuperuserSession: CustomSession = {
  user: {
    id: 'su-1',
    name: 'Super User',
    email: 'admin@company.com',
    role: 'user' as const,
    companyRole: COMPANY_ROLES.SUPERUSER,
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockManagerSession: CustomSession = {
  user: {
    id: 'mgr-1',
    name: 'Manager User',
    email: 'manager@company.com',
    role: 'user' as const,
    companyRole: COMPANY_ROLES.MANAGER,
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockEmployeeSession: CustomSession = {
  user: {
    id: 'emp-1',
    name: 'Employee User',
    email: 'emp@company.com',
    role: 'user' as const,
    companyRole: COMPANY_ROLES.EMPLOYEE,
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const noCompanyRoleSession: CustomSession = {
  user: { id: 'user-1', name: 'Plain User', email: 'plain@example.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockAdminSession: CustomSession = {
  user: { id: 'sysadmin-1', name: 'System Admin', email: 'sysadmin@mentality.app', role: 'admin' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockInviteRaw: InviteEntity = {
  id: 'inv-1',
  email: 'employee@company.com',
  role: COMPANY_ROLES.EMPLOYEE,
  groupIds: ['g-1'],
  companyId: 'c-1',
  status: 'pending',
  createdAt: '2026-01-01T00:00:00.000Z',
  expiresAt: '2026-02-01T00:00:00.000Z',
}

const mockDto: CreateInviteDto = {
  email: 'employee@company.com',
  role: COMPANY_ROLES.EMPLOYEE,
  groupIds: ['g-1'],
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── createInvite ─────────────────────────────────────────────────────────────

describe('createInvite', () => {
  it('returns data on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await createInvite(mockSuperuserSession, 'c-1', mockDto)

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(INVITE_ENDPOINTS.base('c-1')),
      expect.objectContaining({ method: 'POST', body: mockDto })
    )
  })

  it('returns data on success (MANAGER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await createInvite(mockManagerSession, 'c-1', mockDto)

    expect(result).toEqual({ data: mockInviteRaw })
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Network error' })

    const result = await createInvite(mockSuperuserSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Network error' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await createInvite(mockSuperuserSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Invalid invite data' })
  })

  it('blocks EMPLOYEE role — returns unauthorized', async () => {
    const result = await createInvite(mockEmployeeSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks session without companyRole', async () => {
    const result = await createInvite(noCompanyRoleSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await createInvite(null, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── getInvites ───────────────────────────────────────────────────────────────

describe('getInvites', () => {
  it('returns paginated data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockInviteRaw] })

    const result = await getInvites(mockSuperuserSession, 'c-1', 1, 20)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].id).toBe('inv-1')
    }
  })

  it('returns empty items when API returns empty array', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getInvites(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(0)
      expect(result.data.total).toBe(0)
    }
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getInvites(mockSuperuserSession, 'c-1')

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('builds URL with page and limit parameters', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    await getInvites(mockSuperuserSession, 'c-1', 3, 10)

    expect(performAuthRequest).toHaveBeenCalledWith(mockSuperuserSession, expect.stringContaining('page=3'))
    expect(performAuthRequest).toHaveBeenCalledWith(mockSuperuserSession, expect.stringContaining('limit=10'))
  })
})

// ─── resendInvite ─────────────────────────────────────────────────────────────

describe('resendInvite', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await resendInvite(mockSuperuserSession, 'c-1', 'inv-1')

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(INVITE_ENDPOINTS.resend('c-1', 'inv-1')),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await resendInvite(mockSuperuserSession, 'c-1', 'inv-1')

    expect(result).toEqual({ error: 'Not found' })
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await resendInvite(mockEmployeeSession, 'c-1', 'inv-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── cancelInvite ─────────────────────────────────────────────────────────────

describe('cancelInvite', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await cancelInvite(mockSuperuserSession, 'c-1', 'inv-1')

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(INVITE_ENDPOINTS.cancel('c-1', 'inv-1')),
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await cancelInvite(mockSuperuserSession, 'c-1', 'inv-1')

    expect(result).toEqual({ error: 'Conflict' })
  })

  it('blocks null session', async () => {
    const result = await cancelInvite(null, 'c-1', 'inv-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── Admin-scoped variants ────────────────────────────────────────────────────

describe('getInvitesAdmin', () => {
  it('calls performAdminRequest with company-scoped invites URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockInviteRaw] })

    const result = await getInvitesAdmin(mockAdminSession, 'c-1', 2, 10)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].id).toBe('inv-1')
    }
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.invites('c-1', 2, 10))
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns empty items when API returns empty array', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getInvitesAdmin(mockAdminSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(0)
      expect(result.data.total).toBe(0)
    }
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getInvitesAdmin(mockAdminSession, 'c-1')

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('createInviteAdmin', () => {
  it('calls performAdminRequest with POST and company-scoped URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await createInviteAdmin(mockAdminSession, 'c-1', mockDto)

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.inviteBase('c-1')),
      expect.objectContaining({ method: 'POST', body: mockDto })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await createInviteAdmin(mockAdminSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Invalid invite data' })
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createInviteAdmin(mockAdminSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('resendInviteAdmin', () => {
  it('calls performAdminRequest with POST and resend URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await resendInviteAdmin(mockAdminSession, 'c-1', 'inv-1')

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.inviteResend('c-1', 'inv-1')),
      expect.objectContaining({ method: 'POST' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await resendInviteAdmin(mockAdminSession, 'c-1', 'inv-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('cancelInviteAdmin', () => {
  it('calls performAdminRequest with DELETE and invite-by-id URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await cancelInviteAdmin(mockAdminSession, 'c-1', 'inv-1')

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.inviteById('c-1', 'inv-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await cancelInviteAdmin(mockAdminSession, 'c-1', 'inv-1')

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })
})
