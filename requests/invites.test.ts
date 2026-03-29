import { INVITE_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { performAuthRequest } from '@/requests/genericFetch'
import { cancelInvite, createInvite, getInvites, resendInvite } from '@/requests/invites'
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
  user: { email: 'admin@company.com', role: 'user' as const, companyRole: COMPANY_ROLES.SUPERUSER },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockManagerSession: CustomSession = {
  user: { email: 'manager@company.com', role: 'user' as const, companyRole: COMPANY_ROLES.MANAGER },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockEmployeeSession: CustomSession = {
  user: { email: 'emp@company.com', role: 'user' as const, companyRole: COMPANY_ROLES.EMPLOYEE },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const noCompanyRoleSession: CustomSession = {
  user: { email: 'plain@example.com', role: 'user' as const },
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

    const result = await createInvite(mockSuperuserSession, mockDto)

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(INVITE_ENDPOINTS.BASE),
      expect.objectContaining({ method: 'POST', body: mockDto })
    )
  })

  it('returns data on success (MANAGER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await createInvite(mockManagerSession, mockDto)

    expect(result).toEqual({ data: mockInviteRaw })
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Network error' })

    const result = await createInvite(mockSuperuserSession, mockDto)

    expect(result).toEqual({ error: 'Network error' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await createInvite(mockSuperuserSession, mockDto)

    expect(result).toEqual({ error: 'Invalid invite data' })
  })

  it('blocks EMPLOYEE role — returns unauthorized', async () => {
    const result = await createInvite(mockEmployeeSession, mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks session without companyRole', async () => {
    const result = await createInvite(noCompanyRoleSession, mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await createInvite(null, mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── getInvites ───────────────────────────────────────────────────────────────

describe('getInvites', () => {
  it('returns paginated data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockInviteRaw] })

    const result = await getInvites(mockSuperuserSession, 1, 20)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].id).toBe('inv-1')
    }
  })

  it('returns empty items when API returns empty array', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getInvites(mockSuperuserSession)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(0)
      expect(result.data.total).toBe(0)
    }
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getInvites(mockSuperuserSession)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('builds URL with page and limit parameters', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    await getInvites(mockSuperuserSession, 3, 10)

    expect(performAuthRequest).toHaveBeenCalledWith(mockSuperuserSession, expect.stringContaining('page=3'))
    expect(performAuthRequest).toHaveBeenCalledWith(mockSuperuserSession, expect.stringContaining('limit=10'))
  })
})

// ─── resendInvite ─────────────────────────────────────────────────────────────

describe('resendInvite', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await resendInvite(mockSuperuserSession, 'inv-1')

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(INVITE_ENDPOINTS.resend('inv-1')),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await resendInvite(mockSuperuserSession, 'inv-1')

    expect(result).toEqual({ error: 'Not found' })
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await resendInvite(mockEmployeeSession, 'inv-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── cancelInvite ─────────────────────────────────────────────────────────────

describe('cancelInvite', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockInviteRaw })

    const result = await cancelInvite(mockSuperuserSession, 'inv-1')

    expect(result).toEqual({ data: mockInviteRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(INVITE_ENDPOINTS.byId('inv-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await cancelInvite(mockSuperuserSession, 'inv-1')

    expect(result).toEqual({ error: 'Conflict' })
  })

  it('blocks null session', async () => {
    const result = await cancelInvite(null, 'inv-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})
