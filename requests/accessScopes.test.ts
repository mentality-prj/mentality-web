import { ACCESS_SCOPE_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { createAccessScope, deleteAccessScope, getAccessScopes } from '@/requests/accessScopes'
import { performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { AccessScopeEntity } from '@/types/company'
import { COMPANY_ROLES } from '@/types/rbac'

jest.mock('@/requests/genericFetch')
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}))

// Only SUPERUSER can assign managers (CAN_ASSIGN_MANAGERS)
const mockSuperuserSession: CustomSession = {
  user: { email: 'su@company.com', role: 'user' as const, companyRole: COMPANY_ROLES.SUPERUSER },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockManagerSession: CustomSession = {
  user: { email: 'mgr@company.com', role: 'user' as const, companyRole: COMPANY_ROLES.MANAGER },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockEmployeeSession: CustomSession = {
  user: { email: 'emp@company.com', role: 'user' as const, companyRole: COMPANY_ROLES.EMPLOYEE },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockScope: AccessScopeEntity = {
  id: 'scope-1',
  userId: 'user-1',
  groupIds: ['g-1'],
  canViewAnalytics: true,
  companyId: 'c-1',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const mockDto = { userId: 'user-1', groupIds: ['g-1'], canViewAnalytics: true }

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── createAccessScope ────────────────────────────────────────────────────────

describe('createAccessScope', () => {
  it('returns data on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockScope })

    const result = await createAccessScope(mockSuperuserSession, mockDto)

    expect(result).toEqual({ data: mockScope })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(ACCESS_SCOPE_ENDPOINTS.BASE),
      expect.objectContaining({ method: 'POST' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createAccessScope(mockSuperuserSession, mockDto)

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await createAccessScope(mockManagerSession, mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await createAccessScope(mockEmployeeSession, mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await createAccessScope(null, mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── deleteAccessScope ────────────────────────────────────────────────────────

describe('deleteAccessScope', () => {
  it('returns empty object on success (204-like)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: {} })

    const result = await deleteAccessScope(mockSuperuserSession, 'scope-1')

    expect(result).toEqual({})
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(ACCESS_SCOPE_ENDPOINTS.byId('scope-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await deleteAccessScope(mockSuperuserSession, 'scope-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await deleteAccessScope(mockManagerSession, 'scope-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await deleteAccessScope(null, 'scope-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── getAccessScopes ──────────────────────────────────────────────────────────

describe('getAccessScopes', () => {
  it('returns scopes on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockScope] })

    const result = await getAccessScopes(mockSuperuserSession)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('scope-1')
    }
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(ACCESS_SCOPE_ENDPOINTS.BASE)
    )
  })

  it('returns empty array when API returns non-array', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await getAccessScopes(mockSuperuserSession)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toEqual([])
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getAccessScopes(mockSuperuserSession)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})
