import { EMPLOYEE_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { getEmployees, getEmployeesByRole, removeEmployee } from '@/requests/employees'
import { performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { EmployeeEntity } from '@/types/company'
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

const mockEmployeeRaw: EmployeeEntity = {
  id: 'emp-1',
  name: 'Jane Smith',
  email: 'jane@company.com',
  role: COMPANY_ROLES.EMPLOYEE,
  groupIds: ['g-1'],
  groupsCount: 1,
  companyId: 'c-1',
  createdAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── getEmployees ─────────────────────────────────────────────────────────────

describe('getEmployees', () => {
  it('returns paginated data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockEmployeeRaw] })

    const result = await getEmployees(mockSuperuserSession, 1, 20)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].id).toBe('emp-1')
    }
  })

  it('builds URL with page and limit parameters', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    await getEmployees(mockSuperuserSession, 3, 10)

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(EMPLOYEE_ENDPOINTS.paginated(3, 10))
    )
  })

  it('returns empty items for empty array', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getEmployees(mockSuperuserSession)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(0)
      expect(result.data.total).toBe(0)
    }
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getEmployees(mockSuperuserSession)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── getEmployeesByRole ───────────────────────────────────────────────────────

describe('getEmployeesByRole', () => {
  it('returns employees filtered by role', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockEmployeeRaw] })

    const result = await getEmployeesByRole(mockSuperuserSession, COMPANY_ROLES.EMPLOYEE)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
    }
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(EMPLOYEE_ENDPOINTS.byRole(COMPANY_ROLES.EMPLOYEE))
    )
  })

  it('returns empty array when API returns empty', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getEmployeesByRole(mockManagerSession, COMPANY_ROLES.MANAGER)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(0)
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getEmployeesByRole(mockSuperuserSession, COMPANY_ROLES.EMPLOYEE)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── removeEmployee ───────────────────────────────────────────────────────────

describe('removeEmployee', () => {
  it('returns data on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockEmployeeRaw })

    const result = await removeEmployee(mockSuperuserSession, 'emp-1')

    expect(result).toEqual({ data: mockEmployeeRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(EMPLOYEE_ENDPOINTS.byId('emp-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await removeEmployee(mockSuperuserSession, 'emp-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await removeEmployee(mockSuperuserSession, 'emp-1')

    expect(result).toEqual({ error: 'Invalid employee data' })
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await removeEmployee(mockManagerSession, 'emp-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await removeEmployee(mockEmployeeSession, 'emp-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await removeEmployee(null, 'emp-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})
