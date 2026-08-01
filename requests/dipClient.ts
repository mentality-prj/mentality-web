import type {
  DipApiKey,
  DipApiKeyCreated,
  DipConnectionStatus,
  DipDecisionRecord,
  DipFeature,
  DipOrganization,
  DipOrganizationMember,
  DipOrganizationMemberRole,
  DipOrganizationStructure,
  DipOrganizationUnit,
  DipOrganizationUnitType,
  DipWorkflow,
} from '@/types/dip'

type ResultValue<T> = { data: T } | { error: string }

const getDipUrl = () => (process.env.DIP_URL ?? '').trim().replace(/\/+$/, '')
const getDipOrgKey = () => (process.env.DIP_API_KEY ?? '').trim()
const getDipAdminKey = () => (process.env.DIP_ADMIN_API_KEY ?? '').trim()

async function dipFetchWithKey<T>(path: string, key: string): Promise<T | null> {
  const url = getDipUrl()
  if (!url || !key) return null

  try {
    const res = await fetch(`${url}${path}`, {
      headers: { 'X-Api-Key': key, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function dipMutationWithKey<T>(
  path: string,
  key: string,
  init: { method: 'POST' | 'PATCH'; body: Record<string, unknown> }
): Promise<ResultValue<T>> {
  const url = getDipUrl()
  if (!url || !key) {
    return { error: 'DIP is not configured' }
  }

  try {
    const res = await fetch(`${url}${path}`, {
      method: init.method,
      headers: { 'X-Api-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify(init.body),
      cache: 'no-store',
    })

    if (!res.ok) {
      let detail = 'Request failed'
      try {
        const payload = (await res.json()) as { detail?: string }
        detail = payload.detail ?? detail
      } catch {}
      return { error: detail }
    }

    return { data: (await res.json()) as T }
  } catch {
    return { error: 'Request failed' }
  }
}

export function getDipOrgConnectionStatus(): DipConnectionStatus {
  const url = getDipUrl()
  return { configured: Boolean(url && getDipOrgKey()), url: url || null }
}

export function getDipAdminConnectionStatus(): DipConnectionStatus {
  const url = getDipUrl()
  return { configured: Boolean(url && getDipAdminKey()), url: url || null }
}

export async function getDipFeatures(): Promise<DipFeature[]> {
  const data = await dipFetchWithKey<
    Array<{
      id: string
      name: string
      type: string
      source: string
      transformation: string | null
      version: string
      organization_id: string | null
      created_at: string
    }>
  >('/api/v1/features', getDipOrgKey())

  return (data ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    type: f.type as DipFeature['type'],
    source: f.source as DipFeature['source'],
    transformation: f.transformation,
    version: f.version,
    organizationId: f.organization_id,
    createdAt: f.created_at,
  }))
}

export async function getDipDecisions(limit = 50): Promise<DipDecisionRecord[]> {
  const data = await dipFetchWithKey<
    Array<{
      decision_id: string
      workflow_id: string | null
      workflow_name: string
      workflow_version: string
      entity_id: string | null
      organization_id: string | null
      decision: string
      rule_matched: string
      engine_version: string
      timestamp: string
      features_used: Record<string, unknown>
      rules_executed: Array<{ rule: string; matched: boolean; conditions_evaluated: number }>
    }>
  >(`/api/v1/audit?limit=${limit}`, getDipOrgKey())

  return (data ?? []).map((d) => ({
    decisionId: d.decision_id,
    workflowId: d.workflow_id,
    workflowName: d.workflow_name,
    workflowVersion: d.workflow_version,
    entityId: d.entity_id,
    organizationId: d.organization_id,
    decision: d.decision,
    ruleMatched: d.rule_matched,
    engineVersion: d.engine_version,
    timestamp: d.timestamp,
    featuresUsed: d.features_used ?? {},
    rulesExecuted: (d.rules_executed ?? []).map((rule) => ({
      rule: rule.rule,
      matched: rule.matched,
      conditionsEvaluated: rule.conditions_evaluated,
    })),
  }))
}

export async function getDipWorkflows(): Promise<DipWorkflow[]> {
  const data = await dipFetchWithKey<
    Array<{
      id: string
      name: string
      version: string
      status: string
      organization_id: string | null
      created_at: string
      rules: unknown[]
    }>
  >('/api/v1/workflows', getDipOrgKey())

  return (data ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    version: w.version,
    status: w.status as DipWorkflow['status'],
    organizationId: w.organization_id,
    createdAt: w.created_at,
    rulesCount: Array.isArray(w.rules) ? w.rules.length : 0,
  }))
}

export async function getDipOrganizations(): Promise<DipOrganization[]> {
  const data = await dipFetchWithKey<
    Array<{
      id: string
      name: string
      status?: string
      created_at: string
    }>
  >('/api/v1/organizations', getDipAdminKey())

  return (data ?? []).map((o) => ({
    id: o.id,
    name: o.name,
    status: o.status,
    createdAt: o.created_at,
  }))
}

export async function getDipOrganizationStructure(orgId: string): Promise<DipOrganizationStructure | null> {
  const data = await dipFetchWithKey<{
    organization: { id: string; name: string; status?: string; created_at: string }
    units: Array<{
      id: string
      org_id: string
      name: string
      type: DipOrganizationUnitType
      parent_unit_id: string | null
      created_at: string
    }>
    members: Array<{
      id: string
      org_id: string
      name: string
      email: string
      role: DipOrganizationMemberRole
      unit_id: string | null
      status: string
      created_at: string
    }>
  }>(`/api/v1/organizations/${orgId}/structure`, getDipAdminKey())

  if (!data) return null

  return {
    organization: {
      id: data.organization.id,
      name: data.organization.name,
      status: data.organization.status,
      createdAt: data.organization.created_at,
    },
    units: data.units.map((unit) => ({
      id: unit.id,
      orgId: unit.org_id,
      name: unit.name,
      type: unit.type,
      parentUnitId: unit.parent_unit_id,
      createdAt: unit.created_at,
    })),
    members: data.members.map((member) => ({
      id: member.id,
      orgId: member.org_id,
      name: member.name,
      email: member.email,
      role: member.role,
      unitId: member.unit_id,
      status: member.status,
      createdAt: member.created_at,
    })),
  }
}

export async function getDipOrganizationKeys(orgId: string): Promise<DipApiKey[]> {
  const data = await dipFetchWithKey<
    Array<{
      id: string
      key_prefix: string
      org_id: string
      name: string
      environment: string
      scopes: string[]
      created_at: string
      expires_at: string | null
      revoked_at: string | null
      last_used_at: string | null
      created_by: string
    }>
  >(`/api/v1/organizations/${orgId}/keys`, getDipAdminKey())

  return (data ?? []).map((item) => ({
    id: item.id,
    keyPrefix: item.key_prefix,
    orgId: item.org_id,
    name: item.name,
    environment: item.environment,
    scopes: item.scopes,
    createdAt: item.created_at,
    expiresAt: item.expires_at,
    revokedAt: item.revoked_at,
    lastUsedAt: item.last_used_at,
    createdBy: item.created_by,
  }))
}

export async function createDipOrganization(payload: { name: string }): Promise<ResultValue<DipOrganization>> {
  const result = await dipMutationWithKey<{
    id: string
    name: string
    status?: string
    created_at: string
  }>('/api/v1/organizations', getDipAdminKey(), {
    method: 'POST',
    body: payload,
  })

  if ('error' in result) return result

  return {
    data: {
      id: result.data.id,
      name: result.data.name,
      status: result.data.status,
      createdAt: result.data.created_at,
    },
  }
}

export async function createDipOrganizationUnit(
  orgId: string,
  payload: { name: string; type: DipOrganizationUnitType; parentUnitId?: string | null }
): Promise<ResultValue<DipOrganizationUnit>> {
  const result = await dipMutationWithKey<{
    id: string
    org_id: string
    name: string
    type: DipOrganizationUnitType
    parent_unit_id: string | null
    created_at: string
  }>(`/api/v1/organizations/${orgId}/units`, getDipAdminKey(), {
    method: 'POST',
    body: {
      name: payload.name,
      type: payload.type,
      parent_unit_id: payload.parentUnitId ?? null,
    },
  })

  if ('error' in result) return result

  return {
    data: {
      id: result.data.id,
      orgId: result.data.org_id,
      name: result.data.name,
      type: result.data.type,
      parentUnitId: result.data.parent_unit_id,
      createdAt: result.data.created_at,
    },
  }
}

export async function createDipOrganizationMember(
  orgId: string,
  payload: { name: string; email: string; role: DipOrganizationMemberRole; unitId?: string | null }
): Promise<ResultValue<DipOrganizationMember>> {
  const result = await dipMutationWithKey<{
    id: string
    org_id: string
    name: string
    email: string
    role: DipOrganizationMemberRole
    unit_id: string | null
    status: string
    created_at: string
  }>(`/api/v1/organizations/${orgId}/members`, getDipAdminKey(), {
    method: 'POST',
    body: {
      name: payload.name,
      email: payload.email,
      role: payload.role,
      unit_id: payload.unitId ?? null,
    },
  })

  if ('error' in result) return result

  return {
    data: {
      id: result.data.id,
      orgId: result.data.org_id,
      name: result.data.name,
      email: result.data.email,
      role: result.data.role,
      unitId: result.data.unit_id,
      status: result.data.status,
      createdAt: result.data.created_at,
    },
  }
}

export async function updateDipOrganizationMember(
  orgId: string,
  memberId: string,
  payload: { role?: DipOrganizationMemberRole; unitId?: string | null }
): Promise<ResultValue<DipOrganizationMember>> {
  const result = await dipMutationWithKey<{
    id: string
    org_id: string
    name: string
    email: string
    role: DipOrganizationMemberRole
    unit_id: string | null
    status: string
    created_at: string
  }>(`/api/v1/organizations/${orgId}/members/${memberId}`, getDipAdminKey(), {
    method: 'PATCH',
    body: {
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.unitId !== undefined ? { unit_id: payload.unitId } : {}),
    },
  })

  if ('error' in result) return result

  return {
    data: {
      id: result.data.id,
      orgId: result.data.org_id,
      name: result.data.name,
      email: result.data.email,
      role: result.data.role,
      unitId: result.data.unit_id,
      status: result.data.status,
      createdAt: result.data.created_at,
    },
  }
}

export async function createDipOrganizationKey(
  orgId: string,
  payload: { name: string; environment: string; scopes: string[] }
): Promise<ResultValue<DipApiKeyCreated>> {
  const result = await dipMutationWithKey<{
    id: string
    key_prefix: string
    org_id: string
    name: string
    environment: string
    scopes: string[]
    created_at: string
    expires_at: string | null
    revoked_at: string | null
    last_used_at: string | null
    created_by: string
    key: string
  }>(`/api/v1/organizations/${orgId}/keys`, getDipAdminKey(), {
    method: 'POST',
    body: payload,
  })

  if ('error' in result) return result

  return {
    data: {
      id: result.data.id,
      keyPrefix: result.data.key_prefix,
      orgId: result.data.org_id,
      name: result.data.name,
      environment: result.data.environment,
      scopes: result.data.scopes,
      createdAt: result.data.created_at,
      expiresAt: result.data.expires_at,
      revokedAt: result.data.revoked_at,
      lastUsedAt: result.data.last_used_at,
      createdBy: result.data.created_by,
      key: result.data.key,
    },
  }
}

export async function revokeDipOrganizationKey(orgId: string, keyId: string): Promise<ResultValue<DipApiKey>> {
  const result = await dipMutationWithKey<{
    id: string
    key_prefix: string
    org_id: string
    name: string
    environment: string
    scopes: string[]
    created_at: string
    expires_at: string | null
    revoked_at: string | null
    last_used_at: string | null
    created_by: string
  }>(`/api/v1/organizations/${orgId}/keys/${keyId}/revoke`, getDipAdminKey(), {
    method: 'POST',
    body: {},
  })

  if ('error' in result) return result

  return {
    data: {
      id: result.data.id,
      keyPrefix: result.data.key_prefix,
      orgId: result.data.org_id,
      name: result.data.name,
      environment: result.data.environment,
      scopes: result.data.scopes,
      createdAt: result.data.created_at,
      expiresAt: result.data.expires_at,
      revokedAt: result.data.revoked_at,
      lastUsedAt: result.data.last_used_at,
      createdBy: result.data.created_by,
    },
  }
}
