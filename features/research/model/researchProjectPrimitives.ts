import type {
  ResearchExportJob,
  ResearchProjectGroup,
  ResearchProjectPermissionSet,
  ResearchWorkspaceCompanyOption,
  ResearchWorkspaceRole,
} from '@/types/research'

export type JsonObject = Record<string, unknown>

export const EMPTY_PERMISSIONS: ResearchProjectPermissionSet = {
  canViewProject: true,
  canCreateProject: false,
  canUpdateProject: false,
  canManageMembers: false,
  canManageCohort: false,
  canManageGrants: false,
  canViewMlInspection: false,
  canViewHistoryDataset: false,
  canRequestExports: false,
  canViewAudit: false,
}

export const EMPTY_EXPORT_JOB: ResearchExportJob = {
  id: '',
  status: 'not_requested',
  format: 'json',
  requestedAt: null,
  completedAt: null,
}

export const EMPTY_DIAGNOSTICS = {
  modelVersion: '',
  riskScore: '',
  anomalyScore: '',
  adaptiveRisk: '',
  modelHealth: '',
  rawFeatureVector: null,
  auditLog: [],
} as const

export function asObject(value: unknown): JsonObject | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as JsonObject) : null
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

export function getValue(source: JsonObject | null, keys: string[]): unknown {
  if (!source) {
    return undefined
  }

  for (const key of keys) {
    if (key in source) {
      return source[key]
    }
  }

  return undefined
}

export function getString(source: JsonObject | null, keys: string[], fallback = ''): string {
  const value = getValue(source, keys)

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return fallback
}

export function getNullableString(source: JsonObject | null, keys: string[]): string | null {
  const value = getValue(source, keys)

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return null
}

export function getBoolean(source: JsonObject | null, keys: string[], fallback = false): boolean {
  const value = getValue(source, keys)

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }

  return fallback
}

export function getNumber(source: JsonObject | null, keys: string[], fallback = 0): number {
  const value = getValue(source, keys)

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

export function getStringArray(source: JsonObject | null, keys: string[]): string[] {
  const value = getValue(source, keys)

  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string | number | boolean => ['string', 'number', 'boolean'].includes(typeof item))
    .map((item) => String(item))
}

export function pickDefinedEntries(entries: Array<[string, unknown]>): Record<string, unknown> {
  return Object.fromEntries(entries.filter(([, value]) => value !== undefined))
}

export function normalizeOptionalPayloadString(value: string | null | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

export function stringifyValue(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (value === null || value === undefined) {
    return ''
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function flattenRecord(value: unknown, prefix = ''): Record<string, string> {
  const source = asObject(value)
  if (!source) {
    return {}
  }

  return Object.entries(source).reduce<Record<string, string>>((accumulator, [key, nestedValue]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key
    const nestedObject = asObject(nestedValue)

    if (nestedObject) {
      return {
        ...accumulator,
        ...flattenRecord(nestedObject, nextKey),
      }
    }

    accumulator[nextKey] = stringifyValue(nestedValue)
    return accumulator
  }, {})
}

export function toRole(value: string | null): ResearchWorkspaceRole | null {
  return value ? (value as ResearchWorkspaceRole) : null
}

export function derivePermissions(
  role: ResearchWorkspaceRole | null,
  isSystemAdmin: boolean,
  source: JsonObject | null
): ResearchProjectPermissionSet {
  const permissionsSource = asObject(getValue(source, ['permissions', 'actions', 'access']))
  const isPrivileged = isSystemAdmin || role === 'owner' || role === 'research_admin'

  return {
    canViewProject: isSystemAdmin || getBoolean(permissionsSource, ['viewProject', 'canViewProject', 'read'], true),
    canCreateProject:
      isSystemAdmin || getBoolean(permissionsSource, ['createProject', 'canCreateProject'], isPrivileged),
    canUpdateProject:
      isSystemAdmin || getBoolean(permissionsSource, ['updateProject', 'canUpdateProject', 'update'], isPrivileged),
    canManageMembers:
      isSystemAdmin || getBoolean(permissionsSource, ['manageMembers', 'canManageMembers'], isPrivileged),
    canManageCohort: isSystemAdmin || getBoolean(permissionsSource, ['manageCohort', 'canManageCohort'], isPrivileged),
    canManageGrants: isSystemAdmin || getBoolean(permissionsSource, ['manageGrants', 'canManageGrants'], isPrivileged),
    canViewMlInspection:
      isSystemAdmin || getBoolean(permissionsSource, ['viewMlInspection', 'canViewMlInspection'], true),
    canViewHistoryDataset:
      isSystemAdmin || getBoolean(permissionsSource, ['viewHistoryDataset', 'canViewHistoryDataset'], true),
    canRequestExports:
      isSystemAdmin ||
      getBoolean(permissionsSource, ['requestExports', 'canRequestExports'], isPrivileged || role === 'scientist'),
    canViewAudit:
      isSystemAdmin ||
      getBoolean(permissionsSource, ['viewAudit', 'canViewAudit'], isPrivileged || role === 'reviewer'),
  }
}

export function normalizeProjectGroup(value: unknown): ResearchProjectGroup | null {
  const source = asObject(value)
  if (!source) {
    return null
  }

  const id = getString(source, ['id', '_id', 'groupId'])
  if (!id) {
    return null
  }

  return {
    id,
    name: getString(source, ['name', 'title', 'label'], id),
    type: getString(source, ['type', 'groupType'], 'team'),
  }
}

export function normalizeWorkspaceCompanyOption(value: unknown): ResearchWorkspaceCompanyOption | null {
  if (typeof value === 'string' || typeof value === 'number') {
    const normalizedValue = String(value)

    if (!normalizedValue) {
      return null
    }

    return {
      id: normalizedValue,
      name: normalizedValue,
    }
  }

  const source = asObject(value)

  if (!source) {
    return null
  }

  const id = getString(source, ['id', '_id', 'companyId'])

  if (!id) {
    return null
  }

  return {
    id,
    name: getString(source, ['name', 'companyName', 'title', 'label'], id),
  }
}

export function hasResolvedCompanyLabel(company: ResearchWorkspaceCompanyOption): boolean {
  const normalizedName = company.name.trim()

  return normalizedName.length > 0 && normalizedName !== company.id
}

export function upsertWorkspaceCompanyOption(
  companiesMap: Map<string, ResearchWorkspaceCompanyOption>,
  company: ResearchWorkspaceCompanyOption
) {
  const normalizedCompany = {
    id: company.id,
    name: company.name.trim() || company.id,
  }
  const currentCompany = companiesMap.get(normalizedCompany.id)

  if (!currentCompany || !hasResolvedCompanyLabel(currentCompany)) {
    companiesMap.set(normalizedCompany.id, normalizedCompany)
  }
}
