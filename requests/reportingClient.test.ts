import { logger } from '@/lib/logger'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import { getAdminDiagnosticsInspectionVM, getMLInspectionVM, getRiskEventsVM } from '@/requests/reportingClient'
import { CustomSession } from '@/types/auth'

jest.mock('@/requests/genericFetch', () => ({
  performAdminRequest: jest.fn(),
  performAuthRequest: jest.fn(),
}))

jest.mock('@/requests/config', () => ({
  APIUrl: 'http://localhost:3200/api',
}))

jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}))

const mockSession: CustomSession = {
  user: {
    id: 'user-1',
    name: 'Reporting User',
    email: 'reporting.user@example.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
}

describe('reportingClient URL normalization', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Network error' })
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Network error' })
  })

  it('requests the operational risk feed without duplicating the api prefix', async () => {
    await getRiskEventsVM({ session: mockSession, companyId: 'company-1', locale: 'uk' })

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/operational/v1/risk-events/feed',
      undefined
    )
    expect(logger.error).toHaveBeenCalledWith('Failed to request reporting projection', {
      admin: false,
      error: 'Network error',
      path: '/api/operational/v1/risk-events/feed',
    })
  })

  it('requests admin diagnostics projections without duplicating the api prefix', async () => {
    await getMLInspectionVM(mockSession, 'company-1', 'company', '64e000000000000000000001', 'uk')

    expect(performAdminRequest).toHaveBeenNthCalledWith(
      1,
      mockSession,
      'http://localhost:3200/api/operational/v1/ml/inspection?target=company&targetId=64e000000000000000000001',
      undefined
    )
    expect(performAdminRequest).toHaveBeenNthCalledWith(
      2,
      mockSession,
      'http://localhost:3200/api/admin-diagnostics/v1/ml/inspection?target=company&targetId=64e000000000000000000001',
      undefined
    )
    expect(performAdminRequest).toHaveBeenNthCalledWith(
      3,
      mockSession,
      'http://localhost:3200/api/admin-diagnostics/v1/ml/policy-metrics?companyId=company-1',
      undefined
    )
  })

  it('requests global admin policy metrics without duplicating the api prefix', async () => {
    await getAdminDiagnosticsInspectionVM(mockSession, 'company-1', 'uk')

    expect(performAdminRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/admin-diagnostics/v1/ml/policy-metrics?companyId=company-1',
      undefined
    )
  })
})
