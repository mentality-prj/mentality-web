import { randomUUID } from 'node:crypto'

import { getServerSession } from '@/lib/auth/server'
import { APIUrl } from '@/requests/config'
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

import 'server-only'

type ResultValue<T> = { data: T } | { error: string }

type Method = 'GET' | 'POST' | 'PATCH'
type BackendResult<T> = { ok: true; data: T } | { ok: false; status: number }

// QDIP credentials are only permitted in NestJS. The Next.js server never
// sends X-Api-Key and cannot bypass the QDIP_ADMIN_MUTATIONS_ENABLED gate.
function getNestUrl(): string | null {
  try {
    const url = new URL(APIUrl.trim().replace(/\/+$/, ''))
    if (url.username || url.password || url.search || url.hash) return null
    if (
      url.protocol !== 'https:' &&
      !(
        process.env.NODE_ENV !== 'production' &&
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname)
      )
    )
      return null
    if (!url.pathname.endsWith('/api')) return null
    return url.href.replace(/\/+$/, '')
  } catch {
    return null
  }
}
function orgSegment(value: string): string | null {
  return /^[A-Za-z0-9_-]{1,128}$/.test(value) ? encodeURIComponent(value) : null
}

// Explicit API allowlist: never interpret raw org/member IDs as URL paths.
function isAllowedDipRoute(path: string, method: Method): boolean {
  const [route, query, extra] = path.split('?')
  if (extra !== undefined || /[.%\\]/.test(route)) return false
  const parts = route.split('/').slice(1)
  if (parts[0] !== 'organizations') return false
  if (parts.length === 1) return query === undefined && (method === 'GET' || method === 'POST')
  if (!orgSegment(parts[1])) return false
  if (method === 'GET' && parts.length === 3) {
    const resource = parts[2]
    if (resource === 'audit') return query === undefined || /^limit=(?:[1-9]\d{0,2})$/.test(query)
    return query === undefined && ['structure', 'features', 'workflows', 'keys'].includes(resource)
  }
  if (query !== undefined) return false
  if (method === 'POST' && parts.length === 3) {
    return ['units', 'members', 'keys'].includes(parts[2])
  }
  if (method === 'PATCH' && parts.length === 4) {
    return parts[2] === 'members' && Boolean(orgSegment(parts[3]))
  }
  if (method === 'POST' && parts.length === 5) {
    return parts[2] === 'keys' && Boolean(orgSegment(parts[3])) && parts[4] === 'revoke'
  }
  return false
}

async function nestAdminRequest<T>(
  path: string,
  method: Method = 'GET',
  payload?: Record<string, unknown>
): Promise<BackendResult<T>> {
  const base = getNestUrl()
  if (!base || !isAllowedDipRoute(path, method)) return { ok: false, status: 503 }
  // The NestJS controller independently requires Mongo admin and the exact
  // Zitadel subject allowlist; the Next.js role check is only defense in depth.
  const session = await getServerSession()
  if (session?.user?.role !== 'admin' || !session.OAuthToken) return { ok: false, status: 403 }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(base + '/dip-admin' + path, {
      method,
      headers: {
        Authorization: 'Bearer ' + session.OAuthToken,
        Accept: 'application/json',
        ...(method === 'GET'
          ? {}
          : {
              'Content-Type': 'application/json',
              'Idempotency-Key': randomUUID(),
            }),
      },
      ...(method === 'GET' ? {} : { body: JSON.stringify(payload ?? {}) }),
      cache: 'no-store',
      redirect: 'manual',
      signal: controller.signal,
    })
    if (!response.ok || (response.status >= 300 && response.status < 400)) return { ok: false, status: response.status }
    return { ok: true, data: (await response.json()) as T }
  } catch {
    return { ok: false, status: 502 }
  } finally {
    clearTimeout(timeout)
  }
}

async function dipRead<T>(path: string): Promise<T | null> {
  const result = await nestAdminRequest<T>(path)
  return result.ok ? result.data : null
}
async function dipMutationWithKey<T>(
  path: string,
  init: { method: 'POST' | 'PATCH'; body: Record<string, unknown> }
): Promise<ResultValue<T>> {
  const result = await nestAdminRequest<T>(path, init.method, init.body)
  if (result.ok) return { data: result.data }
  // Never echo upstream error bodies or encourage automatic replay after
  // uncertain writes with fresh Idempotency-Key UUIDs.
  if ([409, 502, 504].includes(result.status))
    return { error: 'QDIP result uncertain or conflicting; verify audit before retrying' }
  if ([401, 403].includes(result.status)) return { error: 'Not authorized to manage QDIP' }
  if (result.status === 503) return { error: 'QDIP administration is unavailable or mutations are disabled' }
  if (result.status === 400) return { error: 'Invalid QDIP request' }
  return { error: 'Request failed' }
}

// Transport availability only: never expose or inspect upstream QDIP keys.
export function getDipOrgConnectionStatus(): DipConnectionStatus {
  return { configured: Boolean(getNestUrl()), url: null }
}
export function getDipAdminConnectionStatus(): DipConnectionStatus {
  return { configured: Boolean(getNestUrl()), url: null }
}

export async function getDipFeatures(organizationId?: string | null): Promise<DipFeature[]> {
  const id = organizationId && orgSegment(organizationId)
  if (!id) return []
  const data = await dipRead<
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
  >('/organizations/' + id + '/features')
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

export async function getDipDecisions(limit = 50, organizationId?: string | null): Promise<DipDecisionRecord[]> {
  const id = organizationId && orgSegment(organizationId)
  if (!id) return []
  const boundedLimit = Number.isSafeInteger(limit) && limit >= 1 && limit <= 200 ? limit : 50
  const data = await dipRead<
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
  >('/organizations/' + id + '/audit?limit=' + boundedLimit)
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

export async function getDipWorkflows(organizationId?: string | null): Promise<DipWorkflow[]> {
  const id = organizationId && orgSegment(organizationId)
  if (!id) return []
  const data = await dipRead<
    Array<{
      id: string
      name: string
      version: string
      status: string
      organization_id: string | null
      created_at: string
      rulesCount: number
    }>
  >('/organizations/' + id + '/workflows')
  return (data ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    version: w.version,
    status: w.status as DipWorkflow['status'],
    organizationId: w.organization_id,
    createdAt: w.created_at,
    rulesCount: w.rulesCount ?? 0,
  }))
}

export async function getDipOrganizations(): Promise<DipOrganization[]> {
  const data = await dipRead<Array<{ id: string; name: string; status?: string; created_at: string }>>('/organizations')
  return (data ?? []).map((o) => ({
    id: o.id,
    name: o.name,
    status: o.status,
    createdAt: o.created_at,
  }))
}

export async function getDipOrganizationStructure(orgId: string): Promise<DipOrganizationStructure | null> {
  const id = orgSegment(orgId)
  if (!id) return null
  const data = await dipRead<{
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
  }>('/organizations/' + id + '/structure')
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
  const id = orgSegment(orgId)
  if (!id) return []
  const data = await dipRead<
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
  >('/organizations/' + id + '/keys')
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
  }>('/organizations', {
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
  }>(`/organizations/${orgId}/units`, {
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
  }>(`/organizations/${orgId}/members`, {
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
  }>(`/organizations/${orgId}/members/${memberId}`, {
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
  }>(`/organizations/${orgId}/keys`, {
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
  }>(`/organizations/${orgId}/keys/${keyId}/revoke`, {
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
