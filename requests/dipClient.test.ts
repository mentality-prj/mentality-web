import { getDipAdminConnectionStatus, getDipDecisions, getDipFeatures } from '@/requests/dipClient'

describe('dipClient', () => {
  const originalFetch = global.fetch
  const originalEnv = process.env
  const mockFetch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = mockFetch as unknown as typeof fetch
    process.env = {
      ...originalEnv,
      DIP_URL: 'http://localhost:8000/',
      DIP_API_KEY: 'org-key',
      DIP_ADMIN_API_KEY: 'admin-key',
    }
  })

  afterAll(() => {
    global.fetch = originalFetch
    process.env = originalEnv
  })

  it('maps decision rules to camelCase and uses no-store cache for authenticated reads', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            decision_id: 'd-1',
            workflow_id: 'wf-1',
            workflow_name: 'Workflow',
            workflow_version: '1.0.0',
            entity_id: 'entity-1',
            organization_id: 'org-1',
            decision: 'allow',
            rule_matched: 'rule-A',
            engine_version: '0.7',
            timestamp: '2026-08-01T12:00:00.000Z',
            features_used: { age: 42 },
            rules_executed: [{ rule: 'rule-A', matched: true, conditions_evaluated: 3 }],
          },
        ]),
    })

    const result = await getDipDecisions(10)

    expect(result).toEqual([
      expect.objectContaining({
        decisionId: 'd-1',
        rulesExecuted: [{ rule: 'rule-A', matched: true, conditionsEvaluated: 3 }],
      }),
    ])
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/audit?limit=10',
      expect.objectContaining({
        cache: 'no-store',
        headers: { 'X-Api-Key': 'org-key', 'Content-Type': 'application/json' },
      })
    )
  })

  it('returns empty result when JSON parsing fails in dipFetchWithKey', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('bad json')),
    })

    const result = await getDipFeatures()

    expect(result).toEqual([])
  })

  it('reports admin connection as not configured when admin key is missing', () => {
    process.env = {
      ...process.env,
      DIP_URL: 'http://localhost:8000',
      DIP_ADMIN_API_KEY: '',
    }

    expect(getDipAdminConnectionStatus()).toEqual({
      configured: false,
      url: 'http://localhost:8000',
    })
  })
})
