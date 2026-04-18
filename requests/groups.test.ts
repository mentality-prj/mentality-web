import { COMPANY_ADMIN_ENDPOINTS, GROUP_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import {
  createGroup,
  createGroupAdmin,
  deleteGroup,
  deleteGroupAdmin,
  getGroups,
  getGroupsAdmin,
  updateGroup,
  updateGroupAdmin,
} from '@/requests/groups'
import { CustomSession } from '@/types/auth'
import { GroupEntity } from '@/types/company'
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

// Only SUPERUSER can manage groups (CAN_MANAGE_GROUPS)
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

const mockGroupRaw: GroupEntity = {
  id: 'g-1',
  name: 'Engineering',
  type: 'department',
  companyId: 'c-1',
  parentGroupId: null,
  children: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── getGroups ────────────────────────────────────────────────────────────────

describe('getGroups', () => {
  it('returns mapped groups on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockGroupRaw] })

    const result = await getGroups(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('g-1')
    }
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(GROUP_ENDPOINTS.byCompany('c-1'))
    )
  })

  it('returns empty array when API returns empty', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getGroups(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(0)
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getGroups(mockSuperuserSession, 'c-1')

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── createGroup ──────────────────────────────────────────────────────────────

describe('createGroup', () => {
  it('returns data on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await createGroup(mockSuperuserSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(GROUP_ENDPOINTS.byCompany('c-1')),
      expect.objectContaining({ method: 'POST' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createGroup(mockSuperuserSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await createGroup(mockSuperuserSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await createGroup(mockManagerSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await createGroup(mockEmployeeSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await createGroup(null, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── updateGroup ──────────────────────────────────────────────────────────────

describe('updateGroup', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await updateGroup(mockSuperuserSession, 'c-1', 'g-1', { name: 'Backend' })

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(GROUP_ENDPOINTS.byId('c-1', 'g-1')),
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await updateGroup(mockSuperuserSession, 'c-1', 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Not found' })
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await updateGroup(mockSuperuserSession, 'c-1', 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await updateGroup(mockManagerSession, 'c-1', 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── deleteGroup ──────────────────────────────────────────────────────────────

describe('deleteGroup', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await deleteGroup(mockSuperuserSession, 'c-1', 'g-1')

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(GROUP_ENDPOINTS.byId('c-1', 'g-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await deleteGroup(mockSuperuserSession, 'c-1', 'g-1')

    expect(result).toEqual({ error: 'Conflict' })
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await deleteGroup(mockSuperuserSession, 'c-1', 'g-1')

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await deleteGroup(mockEmployeeSession, 'c-1', 'g-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await deleteGroup(null, 'c-1', 'g-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── Admin-scoped variants ────────────────────────────────────────────────────

describe('getGroupsAdmin', () => {
  it('calls performAdminRequest with company-scoped groups URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockGroupRaw] })

    const result = await getGroupsAdmin(mockAdminSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('g-1')
    }
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groups('c-1'))
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns empty array when API returns empty', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getGroupsAdmin(mockAdminSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(0)
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getGroupsAdmin(mockAdminSession, 'c-1')

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('createGroupAdmin', () => {
  it('calls performAdminRequest with POST and company-scoped URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await createGroupAdmin(mockAdminSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groups('c-1')),
      expect.objectContaining({ method: 'POST' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await createGroupAdmin(mockAdminSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createGroupAdmin(mockAdminSession, 'c-1', { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('updateGroupAdmin', () => {
  it('calls performAdminRequest with PATCH and group-by-id URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await updateGroupAdmin(mockAdminSession, 'c-1', 'g-1', { name: 'Backend' })

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groupById('c-1', 'g-1')),
      expect.objectContaining({ method: 'PATCH' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await updateGroupAdmin(mockAdminSession, 'c-1', 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await updateGroupAdmin(mockAdminSession, 'c-1', 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('deleteGroupAdmin', () => {
  it('calls performAdminRequest with DELETE and group-by-id URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await deleteGroupAdmin(mockAdminSession, 'c-1', 'g-1')

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.groupById('c-1', 'g-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await deleteGroupAdmin(mockAdminSession, 'c-1', 'g-1')

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await deleteGroupAdmin(mockAdminSession, 'c-1', 'g-1')

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })
})
