import { ACCESS_SCOPE_ENDPOINTS, COMPANY_ADMIN_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import {
  createAccessScope,
  createAccessScopeAdmin,
  deleteAccessScope,
  deleteAccessScopeAdmin,
  getAccessScopes,
  getAccessScopesAdmin,
} from '@/requests/accessScopes'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { AccessScopeEntity, CreateAccessScopeDto } from '@/types/company'
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
  user: {
    id: 'su-1',
    name: 'Super User',
    email: 'su@company.com',
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
    email: 'mgr@company.com',
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

const mockAdminSession: CustomSession = {
  user: { id: 'sysadmin-1', name: 'System Admin', email: 'sysadmin@mentality.app', role: 'admin' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockScope: AccessScopeEntity = {
  id: 'scope-1',
  userId: 'user-1',
  groupId: 'g-1',
  permission: 'VIEW_ANALYTICS',
  companyId: 'c-1',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const mockDto: CreateAccessScopeDto = {
  userId: 'user-1',
  groupId: 'g-1',
  permission: 'VIEW_ANALYTICS',
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── createAccessScope ────────────────────────────────────────────────────────

describe('createAccessScope', () => {
  it('returns data on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockScope })

    const result = await createAccessScope(mockSuperuserSession, 'c-1', mockDto)

    expect(result).toEqual({ data: mockScope })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(ACCESS_SCOPE_ENDPOINTS.base('c-1')),
      expect.objectContaining({ method: 'POST' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createAccessScope(mockSuperuserSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await createAccessScope(mockManagerSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await createAccessScope(mockEmployeeSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await createAccessScope(null, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── deleteAccessScope ────────────────────────────────────────────────────────

describe('deleteAccessScope', () => {
  it('returns empty object on success (204-like)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: {} })

    const result = await deleteAccessScope(mockSuperuserSession, 'c-1', 'scope-1')

    expect(result).toEqual({})
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(ACCESS_SCOPE_ENDPOINTS.byId('c-1', 'scope-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await deleteAccessScope(mockSuperuserSession, 'c-1', 'scope-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await deleteAccessScope(mockManagerSession, 'c-1', 'scope-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await deleteAccessScope(null, 'c-1', 'scope-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── getAccessScopes ──────────────────────────────────────────────────────────

describe('getAccessScopes', () => {
  it('returns scopes on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockScope] })

    const result = await getAccessScopes(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('scope-1')
    }
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(ACCESS_SCOPE_ENDPOINTS.base('c-1'))
    )
  })

  it('returns empty array when API returns non-array', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await getAccessScopes(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toEqual([])
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getAccessScopes(mockSuperuserSession, 'c-1')

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('drops legacy scope when analytics permission is explicitly disabled', async () => {
    const legacyScopePayload: Record<string, unknown> = {
      ...(mockScope as unknown as Record<string, unknown>),
      permission: undefined,
      canViewAnalytics: false,
    }

    ;(performAuthRequest as jest.Mock).mockResolvedValue({
      data: [legacyScopePayload],
    })

    const result = await getAccessScopes(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toEqual([])
    }
  })

  it('expands legacy groupIds to separate normalized scopes', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 'scope-legacy',
          userId: 'user-1',
          groupIds: ['g-1', 'g-2'],
          permission: 'VIEW_ANALYTICS',
        },
      ],
    })

    const result = await getAccessScopes(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(2)
      expect(result.data.map((scope) => scope.groupId)).toEqual(['g-1', 'g-2'])
    }
  })
})

// ─── Admin-scoped variants ────────────────────────────────────────────────────

describe('getAccessScopesAdmin', () => {
  it('calls performAdminRequest with company-scoped access-scopes URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockScope] })

    const result = await getAccessScopesAdmin(mockAdminSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('scope-1')
    }
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.accessScopes('c-1'))
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns empty array when API returns non-array', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await getAccessScopesAdmin(mockAdminSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toEqual([])
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getAccessScopesAdmin(mockAdminSession, 'c-1')

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('createAccessScopeAdmin', () => {
  it('calls performAdminRequest with POST and company-scoped URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockScope })

    const result = await createAccessScopeAdmin(mockAdminSession, 'c-1', mockDto)

    expect(result).toEqual({ data: mockScope })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.accessScopes('c-1')),
      expect.objectContaining({ method: 'POST', body: mockDto })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createAccessScopeAdmin(mockAdminSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns invalid response when permission is unsupported and legacy flag is false', async () => {
    const unsupportedPermissionPayload: Record<string, unknown> = {
      ...(mockScope as unknown as Record<string, unknown>),
      permission: 'SOME_OTHER_PERMISSION',
      canViewAnalytics: false,
    }

    ;(performAdminRequest as jest.Mock).mockResolvedValue({
      data: unsupportedPermissionPayload,
    })

    const result = await createAccessScopeAdmin(mockAdminSession, 'c-1', mockDto)

    expect(result).toEqual({ error: 'Invalid access scope response' })
  })
})

describe('deleteAccessScopeAdmin', () => {
  it('calls performAdminRequest with DELETE and access-scope-by-id URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: {} })

    const result = await deleteAccessScopeAdmin(mockAdminSession, 'c-1', 'scope-1')

    expect(result).toEqual({})
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.accessScopeById('c-1', 'scope-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await deleteAccessScopeAdmin(mockAdminSession, 'c-1', 'scope-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})
