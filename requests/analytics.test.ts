import { logger } from '@/lib/logger'
import { getMoodAnalytics, getMoodAnalyticsAdmin } from '@/requests/analytics'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { AnalyticsResponse, RiskDistribution } from '@/types/company'
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

const mockAdminSession: CustomSession = {
  user: { id: 'admin-1', name: 'Admin User', email: 'admin@app.com', role: 'admin' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockRiskDistribution: RiskDistribution = { low: 57, medium: 27, high: 5 }

const mockAnalytics: AnalyticsResponse = {
  companyId: 'co-1',
  from: '2025-04-03T00:00:00.000Z',
  to: '2026-04-03T00:00:00.000Z',
  totalEmployees: 89,
  activeEmployees: 82,
  totalCheckins: 13648,
  avgMood: 3,
  avgStress: 3.4,
  avgEnergy: 2.8,
  avgFocus: 3.1,
  riskDistribution: mockRiskDistribution,
  groups: [],
  trend: [],
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── getMoodAnalytics ─────────────────────────────────────────────────────────

describe('getMoodAnalytics', () => {
  it('calls the company-scoped endpoint with required params', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    await getMoodAnalytics(mockManagerSession, 'co-1', { from: '2025-04-03', to: '2026-04-03' })

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockManagerSession,
      expect.stringContaining('/companies/co-1/analytics/mood')
    )
    expect(performAuthRequest).toHaveBeenCalledWith(mockManagerSession, expect.stringContaining('from=2025-04-03'))
    expect(performAuthRequest).toHaveBeenCalledWith(mockManagerSession, expect.stringContaining('to=2026-04-03'))
  })

  it('does NOT call /analytics/mood (the non-existent endpoint)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    await getMoodAnalytics(mockManagerSession, 'co-1', { from: '2025-04-03', to: '2026-04-03' })

    const calledUrl = (performAuthRequest as jest.Mock).mock.calls[0][1] as string
    expect(calledUrl).not.toMatch(/^[^?]*\/api\/analytics\/mood/)
  })

  it('includes groupIds in the query string when provided', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    await getMoodAnalytics(mockManagerSession, 'co-1', {
      from: '2025-04-03',
      to: '2026-04-03',
      groupIds: ['g-1', 'g-2'],
    })

    expect(performAuthRequest).toHaveBeenCalledWith(mockManagerSession, expect.stringContaining('groupIds=g-1%2Cg-2'))
  })

  it('omits groupIds from query string when array is empty', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    await getMoodAnalytics(mockManagerSession, 'co-1', {
      from: '2025-04-03',
      to: '2026-04-03',
      groupIds: [],
    })

    const calledUrl = (performAuthRequest as jest.Mock).mock.calls[0][1] as string
    expect(calledUrl).not.toContain('groupIds')
  })

  it('returns the analytics object on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    const result = await getMoodAnalytics(mockManagerSession, 'co-1', {
      from: '2025-04-03',
      to: '2026-04-03',
    })

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.totalEmployees).toBe(89)
      expect(result.data.avgMood).toBe(3)
      expect(result.data.riskDistribution).toEqual(mockRiskDistribution)
    }
  })

  it('returns error when API call fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Forbidden' })

    const result = await getMoodAnalytics(mockManagerSession, 'co-1', {
      from: '2025-04-03',
      to: '2026-04-03',
    })

    expect(result).toEqual({ error: 'Forbidden' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns error for null session (performAuthRequest propagates)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized' })

    const result = await getMoodAnalytics(null, 'co-1', { from: '2025-04-03', to: '2026-04-03' })

    expect(result).toEqual({ error: 'Unauthorized' })
  })
})

// ─── getMoodAnalyticsAdmin ─────────────────────────────────────────────────────

describe('getMoodAnalyticsAdmin', () => {
  it('calls performAdminRequest (not performAuthRequest)', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    await getMoodAnalyticsAdmin(mockAdminSession, 'co-1', { from: '2025-04-03', to: '2026-04-03' })

    expect(performAdminRequest).toHaveBeenCalled()
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('calls the company-scoped endpoint', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    await getMoodAnalyticsAdmin(mockAdminSession, 'co-42', { from: '2025-04-03', to: '2026-04-03' })

    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining('/companies/co-42/analytics/mood')
    )
  })

  it('returns analytics data on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockAnalytics })

    const result = await getMoodAnalyticsAdmin(mockAdminSession, 'co-1', {
      from: '2025-04-03',
      to: '2026-04-03',
    })

    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.totalCheckins).toBe(13648)
    }
  })

  it('returns error when API call fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Internal Server Error' })

    const result = await getMoodAnalyticsAdmin(mockAdminSession, 'co-1', {
      from: '2025-04-03',
      to: '2026-04-03',
    })

    expect(result).toEqual({ error: 'Internal Server Error' })
    expect(logger.error).toHaveBeenCalled()
  })
})
