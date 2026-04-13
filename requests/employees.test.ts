import { COMPANY_ADMIN_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import {
  getEmployees,
  getEmployeesAdmin,
  getEmployeesByRole,
  getEmployeesByRoleAdmin,
  removeEmployee,
  removeEmployeeAdmin,
  updateEmployee,
  updateEmployeeAdmin,
} from '@/requests/employees'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
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

const mockAdminSession: CustomSession = {
  user: { email: 'sysadmin@mentality.app', role: 'admin' as const },
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

    const result = await getEmployees(mockSuperuserSession, 'c-1', 1, 20)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].id).toBe('emp-1')
    }
  })

  it('builds URL with page and limit parameters', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    await getEmployees(mockSuperuserSession, 'c-1', 3, 10)

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(EMPLOYEE_ENDPOINTS.paginated('c-1', 3, 10))
    )
  })

  it('returns empty items for empty array', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getEmployees(mockSuperuserSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(0)
      expect(result.data.total).toBe(0)
    }
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getEmployees(mockSuperuserSession, 'c-1')

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── getEmployeesByRole ───────────────────────────────────────────────────────

describe('getEmployeesByRole', () => {
  it('returns employees filtered by role', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockEmployeeRaw] })

    const result = await getEmployeesByRole(mockSuperuserSession, 'c-1', COMPANY_ROLES.EMPLOYEE)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
    }
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(EMPLOYEE_ENDPOINTS.byRole('c-1', COMPANY_ROLES.EMPLOYEE))
    )
  })

  it('returns empty array when API returns empty', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getEmployeesByRole(mockManagerSession, 'c-1', COMPANY_ROLES.MANAGER)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(0)
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getEmployeesByRole(mockSuperuserSession, 'c-1', COMPANY_ROLES.EMPLOYEE)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── removeEmployee ───────────────────────────────────────────────────────────

describe('removeEmployee', () => {
  it('returns data on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockEmployeeRaw })

    const result = await removeEmployee(mockSuperuserSession, 'c-1', 'emp-1')

    expect(result).toEqual({ data: mockEmployeeRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(EMPLOYEE_ENDPOINTS.byId('c-1', 'emp-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await removeEmployee(mockSuperuserSession, 'c-1', 'emp-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await removeEmployee(mockSuperuserSession, 'c-1', 'emp-1')

    expect(result).toEqual({ error: 'Invalid employee data' })
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await removeEmployee(mockManagerSession, 'c-1', 'emp-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks EMPLOYEE — returns unauthorized', async () => {
    const result = await removeEmployee(mockEmployeeSession, 'c-1', 'emp-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await removeEmployee(null, 'c-1', 'emp-1')

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── Admin-scoped variants ────────────────────────────────────────────────────

describe('getEmployeesAdmin', () => {
  it('calls performAdminRequest with company-scoped employees URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockEmployeeRaw] })

    const result = await getEmployeesAdmin(mockAdminSession, 'c-1', 2, 10)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].id).toBe('emp-1')
    }
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.employees('c-1', 2, 10))
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns empty items for empty array', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getEmployeesAdmin(mockAdminSession, 'c-1')

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.items).toHaveLength(0)
      expect(result.data.total).toBe(0)
    }
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getEmployeesAdmin(mockAdminSession, 'c-1')

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('getEmployeesByRoleAdmin', () => {
  it('calls performAdminRequest with company-scoped byRole URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockEmployeeRaw] })

    const result = await getEmployeesByRoleAdmin(mockAdminSession, 'c-1', COMPANY_ROLES.EMPLOYEE)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(1)
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.employeesByRole('c-1', COMPANY_ROLES.EMPLOYEE))
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns empty array when API returns empty', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [] })

    const result = await getEmployeesByRoleAdmin(mockAdminSession, 'c-1', COMPANY_ROLES.MANAGER)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toHaveLength(0)
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await getEmployeesByRoleAdmin(mockAdminSession, 'c-1', COMPANY_ROLES.EMPLOYEE)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('removeEmployeeAdmin', () => {
  it('calls performAdminRequest with DELETE and company-scoped employee URL', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockEmployeeRaw })

    const result = await removeEmployeeAdmin(mockAdminSession, 'c-1', 'emp-1')

    expect(result).toEqual({ data: mockEmployeeRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.employeeById('c-1', 'emp-1')),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await removeEmployeeAdmin(mockAdminSession, 'c-1', 'emp-1')

    expect(result).toEqual({ error: 'Invalid employee data' })
  })

  it('propagates error from performAdminRequest', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await removeEmployeeAdmin(mockAdminSession, 'c-1', 'emp-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })
})

// ─── updateEmployee ───────────────────────────────────────────────────────────

describe('updateEmployee', () => {
  it('returns updated employee on success (SUPERUSER)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockEmployeeRaw })

    const result = await updateEmployee(mockSuperuserSession, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.MANAGER,
      groupIds: ['g-2'],
    })

    expect(result).toEqual({ data: mockEmployeeRaw })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSuperuserSession,
      expect.stringContaining(EMPLOYEE_ENDPOINTS.byId('c-1', 'emp-1')),
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await updateEmployee(mockSuperuserSession, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.EMPLOYEE,
      groupIds: ['g-1'],
    })

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await updateEmployee(mockSuperuserSession, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.EMPLOYEE,
      groupIds: ['g-1'],
    })

    expect(result).toEqual({ error: 'Invalid employee data' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('blocks MANAGER — returns unauthorized', async () => {
    const result = await updateEmployee(mockManagerSession, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.EMPLOYEE,
      groupIds: ['g-1'],
    })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('blocks null session', async () => {
    const result = await updateEmployee(null, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.EMPLOYEE,
      groupIds: ['g-1'],
    })

    expect(result).toEqual({ error: 'Unauthorized: insufficient role' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })
})

// ─── updateEmployeeAdmin ──────────────────────────────────────────────────────

describe('updateEmployeeAdmin', () => {
  it('returns updated employee on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockEmployeeRaw })

    const result = await updateEmployeeAdmin(mockAdminSession, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.MANAGER,
      groupIds: ['g-2'],
    })

    expect(result).toEqual({ data: mockEmployeeRaw })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ADMIN_ENDPOINTS.employeeById('c-1', 'emp-1')),
      expect.objectContaining({ method: 'PATCH' })
    )
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await updateEmployeeAdmin(mockAdminSession, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.EMPLOYEE,
      groupIds: ['g-1'],
    })

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error on invalid mapped data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { id: '' } })

    const result = await updateEmployeeAdmin(mockAdminSession, 'c-1', 'emp-1', {
      role: COMPANY_ROLES.EMPLOYEE,
      groupIds: ['g-1'],
    })

    expect(result).toEqual({ error: 'Invalid employee data' })
  })
})
