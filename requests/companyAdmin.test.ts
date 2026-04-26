import { COMPANY_ADMIN_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import {
  adminAssignRole,
  adminCancelInvite,
  adminCreateAccessScope,
  adminCreateGroup,
  adminCreateInvite,
  adminDeleteAccessScope,
  adminDeleteGroup,
  adminGetAccessScopes,
  adminGetEmployees,
  adminGetGroups,
  adminGetInvites,
  adminRemoveEmployee,
  adminResendInvite,
  adminUpdateGroup,
} from '@/requests/companyAdmin'
import { performAdminRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import {
  AccessScopeEntity,
  AssignRoleDto,
  CreateAccessScopeDto,
  CreateGroupDto,
  CreateInviteDto,
  EmployeeEntity,
  GroupEntity,
  InviteEntity,
} from '@/types/company'
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

const mockAdminSession: CustomSession = {
  user: { id: 'admin-1', name: 'Admin User', email: 'admin@app.com', role: 'admin' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const COMPANY_ID = 'co-1'
const EMP_ID = 'emp-1'
const GROUP_ID = 'grp-1'
const INVITE_ID = 'inv-1'
const SCOPE_ID = 'scope-1'

const mockEmployee: EmployeeEntity = {
  id: EMP_ID,
  name: 'Jane Smith',
  email: 'jane@company.com',
  role: COMPANY_ROLES.EMPLOYEE,
  groupIds: [GROUP_ID],
  groupsCount: 1,
  companyId: COMPANY_ID,
  createdAt: '2026-01-01T00:00:00.000Z',
}

// Raw API payload shape (uses companyRole, not role)
const mockEmployeeApiPayload = {
  userId: EMP_ID,
  name: 'Jane Smith',
  email: 'jane@company.com',
  companyRole: COMPANY_ROLES.EMPLOYEE,
  groupIds: [GROUP_ID],
  companyId: COMPANY_ID,
  joinedAt: '2026-01-01T00:00:00.000Z',
}

const mockGroup: GroupEntity = {
  id: GROUP_ID,
  name: 'Engineering',
  type: 'team',
  companyId: COMPANY_ID,
  parentGroupId: null,
  children: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const mockInvite: InviteEntity = {
  id: INVITE_ID,
  email: 'new@company.com',
  role: COMPANY_ROLES.EMPLOYEE,
  groupIds: [GROUP_ID],
  companyId: COMPANY_ID,
  status: 'pending',
  createdAt: '2026-01-01T00:00:00.000Z',
  expiresAt: '2026-02-01T00:00:00.000Z',
}

const mockScope: AccessScopeEntity = {
  id: SCOPE_ID,
  userId: EMP_ID,
  groupIds: [GROUP_ID],
  canViewAnalytics: false,
  companyId: COMPANY_ID,
  createdAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── adminGetEmployees ────────────────────────────────────────────────────────

describe('adminGetEmployees', () => {
  it('returns paginated data on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockEmployeeApiPayload] })

    const result = await adminGetEmployees(mockAdminSession, COMPANY_ID, 1, 20)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].id).toBe(EMP_ID)
    }
  })

  it('maps companyRole field from API payload', async () => {
    const managerPayload = { ...mockEmployeeApiPayload, companyRole: COMPANY_ROLES.MANAGER }
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [managerPayload] })

    const result = await adminGetEmployees(mockAdminSession, COMPANY_ID)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items[0].role).toBe(COMPANY_ROLES.MANAGER)
    }
  })

  it('falls back to role field when companyRole is absent', async () => {
    const legacyPayload = {
      userId: EMP_ID,
      name: 'Jane',
      email: 'jane@co.com',
      role: COMPANY_ROLES.SUPERUSER,
      groupIds: [],
    }
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [legacyPayload] })

    const result = await adminGetEmployees(mockAdminSession, COMPANY_ID)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items[0].role).toBe(COMPANY_ROLES.SUPERUSER)
    }
  })

  it('builds URL with page and limit parameters', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [] })

    await adminGetEmployees(mockAdminSession, COMPANY_ID, 3, 50)

    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.employees(COMPANY_ID, 3, 50))
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await adminGetEmployees(mockAdminSession, COMPANY_ID)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminRemoveEmployee ──────────────────────────────────────────────────────

describe('adminRemoveEmployee', () => {
  it('returns data on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockEmployee })

    const result = await adminRemoveEmployee(mockAdminSession, COMPANY_ID, EMP_ID)

    expect('data' in result).toBe(true)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.employeeById(COMPANY_ID, EMP_ID)),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await adminRemoveEmployee(mockAdminSession, COMPANY_ID, EMP_ID)

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await adminRemoveEmployee(mockAdminSession, COMPANY_ID, EMP_ID)

    expect(result).toEqual({ error: 'Invalid employee data' })
  })
})

// ─── adminAssignRole ──────────────────────────────────────────────────────────

describe('adminAssignRole', () => {
  const dto: AssignRoleDto = { companyRole: COMPANY_ROLES.MANAGER, groupIds: [GROUP_ID] }

  it('returns updated employee on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { ...mockEmployee, role: COMPANY_ROLES.MANAGER } })

    const result = await adminAssignRole(mockAdminSession, COMPANY_ID, EMP_ID, dto)

    expect('data' in result).toBe(true)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.employeeRole(COMPANY_ID, EMP_ID)),
      expect.objectContaining({ method: 'PATCH', body: dto })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await adminAssignRole(mockAdminSession, COMPANY_ID, EMP_ID, dto)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminGetGroups ───────────────────────────────────────────────────────────

describe('adminGetGroups', () => {
  it('returns groups array on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockGroup] })

    const result = await adminGetGroups(mockAdminSession, COMPANY_ID)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(1)
  })

  it('builds URL with companyId', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [] })

    await adminGetGroups(mockAdminSession, COMPANY_ID)

    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groups(COMPANY_ID))
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await adminGetGroups(mockAdminSession, COMPANY_ID)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminCreateGroup ─────────────────────────────────────────────────────────

describe('adminCreateGroup', () => {
  const dto: CreateGroupDto = { name: 'Backend', type: 'team' }

  it('returns created group on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockGroup })

    const result = await adminCreateGroup(mockAdminSession, COMPANY_ID, dto)

    expect('data' in result).toBe(true)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groups(COMPANY_ID)),
      expect.objectContaining({ method: 'POST', body: dto })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await adminCreateGroup(mockAdminSession, COMPANY_ID, dto)

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await adminCreateGroup(mockAdminSession, COMPANY_ID, dto)

    expect(result).toEqual({ error: 'Invalid group data' })
  })
})

// ─── adminUpdateGroup ─────────────────────────────────────────────────────────

describe('adminUpdateGroup', () => {
  it('returns updated group on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockGroup })

    const result = await adminUpdateGroup(mockAdminSession, COMPANY_ID, GROUP_ID, { name: 'Renamed' })

    expect('data' in result).toBe(true)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groupById(COMPANY_ID, GROUP_ID)),
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await adminUpdateGroup(mockAdminSession, COMPANY_ID, GROUP_ID, { name: 'X' })

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminDeleteGroup ─────────────────────────────────────────────────────────

describe('adminDeleteGroup', () => {
  it('returns empty object on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({})

    const result = await adminDeleteGroup(mockAdminSession, COMPANY_ID, GROUP_ID)

    expect(result).toEqual({})
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groupById(COMPANY_ID, GROUP_ID)),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await adminDeleteGroup(mockAdminSession, COMPANY_ID, GROUP_ID)

    expect(result).toEqual({ error: 'Forbidden' })
  })
})

// ─── adminGetInvites ──────────────────────────────────────────────────────────

describe('adminGetInvites', () => {
  it('returns paginated data on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockInvite] })

    const result = await adminGetInvites(mockAdminSession, COMPANY_ID, 1, 20)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data.items).toHaveLength(1)
  })

  it('builds URL with page and limit parameters', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [] })

    await adminGetInvites(mockAdminSession, COMPANY_ID, 2, 10)

    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.invites(COMPANY_ID, 2, 10))
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await adminGetInvites(mockAdminSession, COMPANY_ID)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('handles wrapped array in items/data/invites', async () => {
    const payloads = [{ items: [mockInvite] }, { data: [mockInvite] }, { invites: [mockInvite] }]
    for (const data of payloads) {
      ;(performAdminRequest as jest.Mock).mockResolvedValue({ data })
      const result = await adminGetInvites(mockAdminSession, COMPANY_ID)
      expect('data' in result).toBe(true)
      if ('data' in result) {
        expect(result.data.items).toHaveLength(1)
        expect(result.data.items[0].id).toBe(INVITE_ID)
      }
    }
  })

  it('extracts total from pagination.total in payload', async () => {
    const data = { items: [mockInvite], pagination: { total: 42 } }
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data })
    const result = await adminGetInvites(mockAdminSession, COMPANY_ID)
    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.total).toBe(42)
    }
  })

  it('extracts total from headers if present', async () => {
    const data = { items: [mockInvite] }
    const headers = { 'x-total-count': '99' }
    // Patch extractPaginationTotal to return header value
    const extractPaginationTotal = require('@/lib/http').extractPaginationTotal
    extractPaginationTotal.mockImplementation(
      (_headers: any, fallback: any) => Number(headers['x-total-count']) || fallback
    )
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data, headers })
    const result = await adminGetInvites(mockAdminSession, COMPANY_ID)
    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.total).toBe(99)
    }
    // Restore default
    extractPaginationTotal.mockImplementation((_headers: any, fallback: any) => fallback)
  })
})

// ─── adminCreateInvite ────────────────────────────────────────────────────────

describe('adminCreateInvite', () => {
  const dto: CreateInviteDto = { email: 'new@company.com', role: COMPANY_ROLES.EMPLOYEE, groupIds: [GROUP_ID] }
  const expectedBackendInvitePayload = {
    inviteeEmail: 'new@company.com',
    role: COMPANY_ROLES.EMPLOYEE,
    groupId: GROUP_ID,
  }

  it('returns created invite on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockInvite })

    const result = await adminCreateInvite(mockAdminSession, COMPANY_ID, dto)

    expect('data' in result).toBe(true)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.inviteBase(COMPANY_ID)),
      expect.objectContaining({ method: 'POST', body: expectedBackendInvitePayload })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await adminCreateInvite(mockAdminSession, COMPANY_ID, dto)

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await adminCreateInvite(mockAdminSession, COMPANY_ID, dto)

    expect(result).toEqual({ error: 'Invalid invite data' })
  })

  it('returns error when no groups are selected and skips request', async () => {
    const dtoWithoutGroups: CreateInviteDto = { ...dto, groupIds: [] }

    const result = await adminCreateInvite(mockAdminSession, COMPANY_ID, dtoWithoutGroups)

    expect(result).toEqual({ error: 'Group is required' })
    expect(performAdminRequest).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith('Failed to create company invite: no group selected', {
      companyId: COMPANY_ID,
    })
  })
})

// ─── adminResendInvite ────────────────────────────────────────────────────────

describe('adminResendInvite', () => {
  it('returns invite on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockInvite })

    const result = await adminResendInvite(mockAdminSession, COMPANY_ID, INVITE_ID)

    expect('data' in result).toBe(true)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.inviteResend(COMPANY_ID, INVITE_ID)),
      expect.objectContaining({ method: 'POST' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await adminResendInvite(mockAdminSession, COMPANY_ID, INVITE_ID)

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminCancelInvite ────────────────────────────────────────────────────────

describe('adminCancelInvite', () => {
  it('returns empty object on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({})

    const result = await adminCancelInvite(mockAdminSession, COMPANY_ID, INVITE_ID)

    expect(result).toEqual({})
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.inviteById(COMPANY_ID, INVITE_ID)),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await adminCancelInvite(mockAdminSession, COMPANY_ID, INVITE_ID)

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminGetAccessScopes ─────────────────────────────────────────────────────

describe('adminGetAccessScopes', () => {
  it('returns array on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockScope] })

    const result = await adminGetAccessScopes(mockAdminSession, COMPANY_ID)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(1)
  })

  it('returns empty array when API returns non-array', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await adminGetAccessScopes(mockAdminSession, COMPANY_ID)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toEqual([])
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await adminGetAccessScopes(mockAdminSession, COMPANY_ID)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminCreateAccessScope ───────────────────────────────────────────────────

describe('adminCreateAccessScope', () => {
  const dto: CreateAccessScopeDto = { userId: EMP_ID, groupIds: [GROUP_ID], canViewAnalytics: false }

  it('returns created scope on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockScope })

    const result = await adminCreateAccessScope(mockAdminSession, COMPANY_ID, dto)

    expect('data' in result).toBe(true)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.accessScopes(COMPANY_ID)),
      expect.objectContaining({ method: 'POST', body: dto })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await adminCreateAccessScope(mockAdminSession, COMPANY_ID, dto)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── adminDeleteAccessScope ───────────────────────────────────────────────────

describe('adminDeleteAccessScope', () => {
  it('returns empty object on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({})

    const result = await adminDeleteAccessScope(mockAdminSession, COMPANY_ID, SCOPE_ID)

    expect(result).toEqual({})
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.accessScopeById(COMPANY_ID, SCOPE_ID)),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await adminDeleteAccessScope(mockAdminSession, COMPANY_ID, SCOPE_ID)

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})
