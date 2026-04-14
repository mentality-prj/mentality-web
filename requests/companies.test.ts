import { COMPANY_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { createCompany, getCompanies, getCompanyById, getMyCompany } from '@/requests/companies'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { CompanyEntity } from '@/types/company'

jest.mock('@/requests/genericFetch')
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

const mockUserSession: CustomSession = {
  user: { id: 'user-1', name: 'Test User', email: 'user@app.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockCompany: CompanyEntity = {
  id: 'co-1',
  name: 'Acme Corp',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── createCompany ────────────────────────────────────────────────────────────

describe('createCompany', () => {
  it('returns data on success (admin)', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockCompany })

    const result = await createCompany(mockAdminSession, { name: 'Acme Corp' })

    expect(result).toEqual({ data: mockCompany })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ENDPOINTS.BASE),
      expect.objectContaining({ method: 'POST', body: { name: 'Acme Corp' } })
    )
    expect(logger.info).toHaveBeenCalled()
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Conflict' })

    const result = await createCompany(mockAdminSession, { name: 'Acme Corp' })

    expect(result).toEqual({ error: 'Conflict' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns unauthorized for non-admin (performAdminRequest rejects)', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized: Admin role required' })

    const result = await createCompany(mockUserSession, { name: 'Acme Corp' })

    expect(result).toEqual({ error: 'Unauthorized: Admin role required' })
  })
})

// ─── getCompanies ─────────────────────────────────────────────────────────────

describe('getCompanies', () => {
  it('returns array on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: [mockCompany] })

    const result = await getCompanies(mockAdminSession)

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('co-1')
    }
    expect(performAdminRequest).toHaveBeenCalledWith(mockAdminSession, expect.stringContaining(COMPANY_ENDPOINTS.BASE))
  })

  it('returns empty array when API returns non-array', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await getCompanies(mockAdminSession)

    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data).toEqual([])
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getCompanies(mockAdminSession)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns unauthorized for non-admin', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized: Admin role required' })

    const result = await getCompanies(mockUserSession)

    expect(result).toEqual({ error: 'Unauthorized: Admin role required' })
  })
})

// ─── getMyCompany ─────────────────────────────────────────────────────────────

describe('getMyCompany', () => {
  it('returns company on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockCompany })

    const result = await getMyCompany(mockUserSession)

    expect(result).toEqual({ data: mockCompany })
    expect(performAuthRequest).toHaveBeenCalledWith(mockUserSession, expect.stringContaining(COMPANY_ENDPOINTS.MY))
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getMyCompany(mockUserSession)

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('works for null session (defers auth to API layer)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized' })

    const result = await getMyCompany(null)

    expect(result).toEqual({ error: 'Unauthorized' })
  })
})

// ─── getCompanyById ───────────────────────────────────────────────────────────

describe('getCompanyById', () => {
  it('returns company on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockCompany })

    const result = await getCompanyById(mockAdminSession, 'co-1')

    expect(result).toEqual({ data: mockCompany })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(COMPANY_ENDPOINTS.byId('co-1'))
    )
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getCompanyById(mockAdminSession, 'co-1')

    expect(result).toEqual({ error: 'Not found' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns unauthorized for non-admin', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized: Admin role required' })

    const result = await getCompanyById(mockUserSession, 'co-1')

    expect(result).toEqual({ error: 'Unauthorized: Admin role required' })
  })
})
