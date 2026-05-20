import { B2B_DECISION_SUPPORT_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { applyDecisionSupportRiskEventAction, getPolicyMetrics, getRiskEventEvidence } from '@/requests/decisionSupport'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { RiskEventEvidence } from '@/types/decisionSupport'
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

const mockSession: CustomSession = {
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

const COMPANY_ID = 'co-123'
const EVENT_ID = 'evt-456'

const mockEvidence: RiskEventEvidence = {
  eventId: EVENT_ID,
  companyId: COMPANY_ID,
  rawN: 200,
  effectiveN: 140,
  evaluatedN: 140,
  granularityLevel: 'full',
  evidenceStrength: 'high',
  descriptiveOnly: false,
  dataCoverageScore: 70,
  coverageComponents: { sampleSizeComponent: 0.7, completenessComponent: 0.65, inconclusiveComponent: 0.05 },
  inconclusiveRate: 0,
  improvedRateAmongEvaluated: 0.7,
  improvedRate: 0.65,
  uplift: 0.15,
  baselineBucket: 'high',
  trendBucket: 'improving',
  teamSizeBucket: 'large',
  lastComputedAt: '2026-04-25T06:00:00.000Z',
  dataFreshnessDays: 1,
  summary: 'Test summary',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getRiskEventEvidence', () => {
  it('calls the correct endpoint', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockEvidence })

    await getRiskEventEvidence(mockSession, COMPANY_ID, EVENT_ID)

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(B2B_DECISION_SUPPORT_ENDPOINTS.riskEventEvidence(COMPANY_ID, EVENT_ID))
    )
  })

  it('returns evidence data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockEvidence })

    const result = await getRiskEventEvidence(mockSession, COMPANY_ID, EVENT_ID)

    expect(result).toEqual({ data: mockEvidence })
  })

  it('returns { data: null } when API responds with 404', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not Found', status: 404 })

    const result = await getRiskEventEvidence(mockSession, COMPANY_ID, EVENT_ID)

    expect(result).toEqual({ data: null })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('returns { data: null } when response data is absent (204 No Content)', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: undefined })

    const result = await getRiskEventEvidence(mockSession, COMPANY_ID, EVENT_ID)

    expect(result).toEqual({ data: null })
  })

  it('returns { error } and logs for non-404 API errors', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Internal Server Error', status: 500 })

    const result = await getRiskEventEvidence(mockSession, COMPANY_ID, EVENT_ID)

    expect(result).toEqual({ error: 'Internal Server Error' })
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch risk event evidence',
      expect.objectContaining({ companyId: COMPANY_ID, eventId: EVENT_ID })
    )
  })

  it('returns { error } and logs for 401 unauthorized', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized', status: 401 })

    const result = await getRiskEventEvidence(mockSession, COMPANY_ID, EVENT_ID)

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(logger.error).toHaveBeenCalled()
  })

  it('uses the address endpoint when applying a risk event action', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: { id: EVENT_ID } })

    await applyDecisionSupportRiskEventAction(mockSession, COMPANY_ID, EVENT_ID, {
      actionType: 'team_sync',
      note: 'Coordinate next intervention',
    })

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(B2B_DECISION_SUPPORT_ENDPOINTS.riskEventAddress(COMPANY_ID, EVENT_ID)),
      expect.objectContaining({
        method: 'PATCH',
        body: expect.objectContaining({
          resolutionType: 'action_taken',
          resolutionOutcome: expect.stringContaining('team_sync'),
        }),
      })
    )
  })

  it('uses the admin diagnostics policy metrics endpoint', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: { totalRiskEvents: 3 } })

    await getPolicyMetrics(mockSession)

    expect(performAdminRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/admin-diagnostics/v1/ml/policy-metrics'
    )
  })
})
