import { getServerSession } from '@/lib/auth/server'
import {
  createDipOrganization,
  createDipOrganizationKey,
  createDipOrganizationMember,
  createDipOrganizationUnit,
  getDipAdminConnectionStatus,
  getDipDecisions,
  getDipFeatures,
  getDipOrganizations,
  getDipOrganizationKeys,
  getDipOrgConnectionStatus,
  getDipWorkflows,
  revokeDipOrganizationKey,
  updateDipOrganizationMember,
} from '@/requests/dipClient'

// SSR must not execute "server-only" in the Jest client-side test environment.
jest.mock('server-only', () => ({}), { virtual: true })
jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/config', () => ({ APIUrl: 'https://backend.test/api' }))

const authorized = { user: { id: 'u1', role: 'admin' }, OAuthToken: 'opaque-access-token' }
const mockedSession = jest.mocked(getServerSession)
const initialFetch = global.fetch
const fetchMock = jest.fn()

describe('QDIP administration through NestJS only', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock as typeof fetch
    mockedSession.mockResolvedValue(authorized as never)
  })
  afterAll(() => {
    global.fetch = initialFetch
  })
  function successful(data: unknown) {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => data })
  }
  function assertBackendRequest(method = 'GET', path = '/organizations') {
    const [url, options] = fetchMock.mock.calls.at(-1) as [string, RequestInit]
    expect(url).toBe('https://backend.test/api/dip-admin' + path)
    expect(options.method).toBe(method)
    expect(options.redirect).toBe('manual')
    expect(options.cache).toBe('no-store')
    expect(options.headers).toEqual(expect.objectContaining({
      Authorization: 'Bearer opaque-access-token',
      Accept: 'application/json',
    }))
    expect(options.headers).not.toHaveProperty('X-Api-Key')
    if (method !== 'GET') {
      expect(options.headers).toEqual(expect.objectContaining({
        'Content-Type': 'application/json',
        'Idempotency-Key': expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      }))
    }
  }

  it('denies anonymous and non-admin callers before contacting Nest or QDIP', async () => {
    mockedSession.mockResolvedValueOnce(null)
    expect(await getDipOrganizations()).toEqual([])
    mockedSession.mockResolvedValueOnce({
      user: { id: 'u2', role: 'user' },
      OAuthToken: 'unprivileged',
    } as never)
    expect(await createDipOrganization({ name: 'forbidden' })).toEqual({
      error: 'Not authorized to manage QDIP',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('makes organization reads via Nest bearer only, never direct QDIP', async () => {
    successful([{ id: 'org-1', name: 'Research', created_at: '2026-01-01T00:00:00Z' }])
    expect(await getDipOrganizations()).toEqual([
      { id: 'org-1', name: 'Research', status: undefined, createdAt: '2026-01-01T00:00:00Z' },
    ])
    assertBackendRequest()
    expect(getDipAdminConnectionStatus()).toEqual({ configured: true, url: null })
    expect(getDipOrgConnectionStatus()).toEqual({ configured: true, url: null })
  })

  it('requires a selected and safe organization for scoped data', async () => {
    expect(await getDipFeatures()).toEqual([])
    expect(await getDipDecisions()).toEqual([])
    expect(await getDipWorkflows('../../secrets')).toEqual([])
    expect(await getDipOrganizationKeys('x/y')).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps data, counts safe workflow rules and suppresses unclassified feature values', async () => {
    successful([{
      id: 'feature-1', name: 'Stress', type: 'numeric', source: 'events',
      transformation: null, version: 'v1', organization_id: 'org-1', created_at: '2026-01-01',
    }])
    const features = await getDipFeatures('org-1')
    expect(features[0].organizationId).toBe('org-1')
    assertBackendRequest('GET', '/organizations/org-1/features')

    successful([{
      id: 'w1', name: 'Risk', version: 'v1', status: 'active', organization_id: 'org-1',
      created_at: '2026-01-01', rulesCount: 4,
    }])
    expect((await getDipWorkflows('org-1'))[0].rulesCount).toBe(4)
    assertBackendRequest('GET', '/organizations/org-1/workflows')

    successful([{
      decision_id: 'd1', workflow_id: 'w1', workflow_name: 'Risk', workflow_version: 'v1',
      entity_id: 'e1', organization_id: 'org-1', decision: 'allow',
      rule_matched: 'r1', engine_version: 'v1', timestamp: '2026-01-01',
      features_used: {}, features_count: 4,
      rules_executed: [{ rule: 'r1', matched: true, conditions_evaluated: 3 }],
    }])
    const decisions = await getDipDecisions(10, 'org-1')
    expect(decisions[0].rulesExecuted[0].conditionsEvaluated).toBe(3)
    expect(decisions[0].featuresUsed).toEqual({})
    assertBackendRequest('GET', '/organizations/org-1/audit?limit=10')
  })

  it('never returns raw admin error bodies or secrets from a failed QDIP write', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false, status: 503,
      json: async () => ({ token: 'must-never-be-read', secret: 'sensitive' }),
    })
    const result = await createDipOrganization({ name: 'Test' })
    expect(result).toEqual({ error: 'QDIP administration is unavailable or mutations are disabled' })
    expect(JSON.stringify(result)).not.toContain('sensitive')
    assertBackendRequest('POST', '/organizations')
  })

  it('assigns a fresh UUIDv4 idempotency key to each of the six guarded mutation endpoints', async () => {
    const organization = { id: 'org-1', name: 'Demo', created_at: '2026-01-01' }
    const member = {
      id: 'm1', org_id: 'org-1', name: 'Member', email: 'member@invalid.test',
      role: 'scientist', unit_id: null, status: 'active', created_at: '2026-01-01',
    }
    const unit = { id: 'unit-1', org_id: 'org-1', name: 'Unit', type: 'team', parent_unit_id: null, created_at: '2026-01-01' }
    const key = {
      id: 'key-1', org_id: 'org-1', key_prefix: 'prefix', name: 'Demo',
      environment: 'development', scopes: ['audit:read'], created_at: '2026-01-01',
      expires_at: null, revoked_at: null, last_used_at: null, created_by: 'operator',
    }
    successful(organization)
    expect(await createDipOrganization({ name: 'Demo' })).toHaveProperty('data.id', 'org-1')
    successful(unit)
    expect(await createDipOrganizationUnit('org-1', { name: 'Unit', type: 'team' })).toHaveProperty('data.id', 'unit-1')
    successful(member)
    expect(await createDipOrganizationMember('org-1', { name: 'Member', email: 'member@invalid.test', role: 'scientist' })).toHaveProperty('data.id', 'm1')
    successful(member)
    expect(await updateDipOrganizationMember('org-1', 'm1', { role: 'analyst' })).toHaveProperty('data.id', 'm1')
    successful({ ...key, key: 'one-time-secret' })
    expect(await createDipOrganizationKey('org-1', { name: 'Demo', environment: 'development', scopes: ['audit:read'] })).toHaveProperty('data.key', 'one-time-secret')
    successful(key)
    expect(await revokeDipOrganizationKey('org-1', 'key-1')).toHaveProperty('data.keyPrefix', 'prefix')

    expect(fetchMock).toHaveBeenCalledTimes(6)
    const paths = [
      '/organizations', '/organizations/org-1/units', '/organizations/org-1/members',
      '/organizations/org-1/members/m1', '/organizations/org-1/keys',
      '/organizations/org-1/keys/key-1/revoke',
    ]
    const keys = new Set<string>()
    for (let i = 0; i < 6; i++) {
      const [url, init] = fetchMock.mock.calls[i] as [string, RequestInit]
      expect(url).toBe('https://backend.test/api/dip-admin' + paths[i])
      expect(init.method).toBe(i === 3 ? 'PATCH' : 'POST')
      const headers = init.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer opaque-access-token')
      expect(headers['X-Api-Key']).toBeUndefined()
      expect(headers['Idempotency-Key']).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      keys.add(headers['Idempotency-Key'])
    }
    expect(keys.size).toBe(6)
  })
})
