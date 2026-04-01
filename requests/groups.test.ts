import { GROUP_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { performAuthRequest } from '@/requests/genericFetch'
import { createGroup, deleteGroup, getAccessibleGroups, getGroups, updateGroup } from '@/requests/groups'
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

    const result = await getGroups(mockSuperuserSession)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('g-1')
    }
    expect(performAuthRequest).toHaveBeenCalledWith(mockSuperuserSession, expect.stringContaining(GROUP_ENDPOINTS.BASE))
  })

  it('returns empty array when API returns empty', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getGroups(mockSuperuserSession)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(0)
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getGroups(mockSuperuserSession)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── getAccessibleGroups ──────────────────────────────────────────────────────

describe('getAccessibleGroups', () => {
  it('returns accessible groups on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockGroupRaw] })

    const result = await getAccessibleGroups(mockManagerSession)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(1)
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockManagerSession,
      expect.stringContaining(GROUP_ENDPOINTS.accessible)
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getAccessibleGroups(mockEmployeeSession)

    expect(result).toEqual({ error: 'Forbidden' })
  })
})

// ─── createGroup ──────────────────────────────────────────────────────────────

describe('createGroup', () => {
  it('returns data on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await createGroup(mockSuperuserSession, { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(GROUP_ENDPOINTS.BASE),
      expect.objectContaining({ method: 'POST' })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createGroup(mockSuperuserSession, { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await createGroup(mockSuperuserSession, { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await createGroup(mockManagerSession, { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await createGroup(mockEmployeeSession, { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await createGroup(null, { name: 'Engineering', type: 'department' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── updateGroup ──────────────────────────────────────────────────────────────

describe('updateGroup', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await updateGroup(mockSuperuserSession, 'g-1', { name: 'Backend' })

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(GROUP_ENDPOINTS.byId('g-1')),
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await updateGroup(mockSuperuserSession, 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Not found' })
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await updateGroup(mockSuperuserSession, 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await updateGroup(mockManagerSession, 'g-1', { name: 'Backend' })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── deleteGroup ──────────────────────────────────────────────────────────────

describe('deleteGroup', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockGroupRaw })

    const result = await deleteGroup(mockSuperuserSession, 'g-1')

    expect(result).toEqual({ data: mockGroupRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(GROUP_ENDPOINTS.byId('g-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await deleteGroup(mockSuperuserSession, 'g-1')

    expect(result).toEqual({ error: 'Conflict' })
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await deleteGroup(mockSuperuserSession, 'g-1')

    expect(result).toEqual({ error: 'Invalid group data' })
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await deleteGroup(mockEmployeeSession, 'g-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await deleteGroup(null, 'g-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})
