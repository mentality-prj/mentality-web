import { isResearchCompanyBoundaryNotDefined } from '@/helpers/researchErrorMessage'
import { getCompanies, getMyCompany } from '@/requests/companies'
import { APIUrl } from '@/requests/config'
import { performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import {
  ResearchApprovalStatus,
  ResearchAuditEvent,
  ResearchAuditSeverity,
  ResearchConsentMode,
  ResearchDataset,
  ResearchExportFormat,
  ResearchExportJob,
  ResearchExportPolicy,
  ResearchExportRequest,
  ResearchExportResponse,
  ResearchHistoryDataset,
  ResearchHistoryDatasetFilters,
  ResearchHistoryDatasetItem,
  ResearchMLInspection,
  ResearchMLInspectionQuery,
  ResearchModelRun,
  ResearchModelRunStatus,
  ResearchProject,
  ResearchProjectCohort,
  ResearchProjectCohortInput,
  ResearchProjectGrant,
  ResearchProjectGrantInput,
  ResearchProjectGroup,
  ResearchProjectMember,
  ResearchProjectMutationInput,
  ResearchProjectPermissionSet,
  ResearchProjectStatus,
  ResearchPseudonymizationMode,
  ResearchWorkspaceAccess,
  ResearchWorkspaceCapability,
  ResearchWorkspaceCompanyOption,
  ResearchWorkspaceRole,
} from '@/types/research'

type ResultValue<T> = { data: T } | { error: string; status?: number }
type Result<T> = Promise<ResultValue<T>>
type JsonObject = Record<string, unknown>

const RESEARCH_BASE_URL = `${APIUrl}/research/v1/projects`

const EMPTY_PERMISSIONS: ResearchProjectPermissionSet = {
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

const EMPTY_EXPORT_JOB: ResearchExportJob = {
  id: '',
  status: 'not_requested',
  format: 'json',
  requestedAt: null,
  completedAt: null,
}

const EMPTY_DIAGNOSTICS = {
  modelVersion: '',
  riskScore: '',
  anomalyScore: '',
  adaptiveRisk: '',
  modelHealth: '',
  rawFeatureVector: null,
  auditLog: [],
} as const

const inFlightResearchWorkspaceAccessRequests = new Map<string, Promise<ResultValue<ResearchWorkspaceAccess>>>()

function asObject(value: unknown): JsonObject | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as JsonObject) : null
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function getValue(source: JsonObject | null, keys: string[]): unknown {
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

function getString(source: JsonObject | null, keys: string[], fallback = ''): string {
  const value = getValue(source, keys)

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return fallback
}

function getNullableString(source: JsonObject | null, keys: string[]): string | null {
  const value = getValue(source, keys)

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return null
}

function getBoolean(source: JsonObject | null, keys: string[], fallback = false): boolean {
  const value = getValue(source, keys)

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }

  return fallback
}

function getNumber(source: JsonObject | null, keys: string[], fallback = 0): number {
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

function getStringArray(source: JsonObject | null, keys: string[]): string[] {
  const value = getValue(source, keys)

  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string | number | boolean => ['string', 'number', 'boolean'].includes(typeof item))
    .map((item) => String(item))
}

function pickDefinedEntries(entries: Array<[string, unknown]>): Record<string, unknown> {
  return Object.fromEntries(entries.filter(([, value]) => value !== undefined))
}

function normalizeOptionalPayloadString(value: string | null | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function stringifyValue(value: unknown): string {
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

function flattenRecord(value: unknown, prefix = ''): Record<string, string> {
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

function toRole(value: string | null): ResearchWorkspaceRole | null {
  return value ? (value as ResearchWorkspaceRole) : null
}

function derivePermissions(
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

function normalizeProjectGroup(value: unknown): ResearchProjectGroup | null {
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

function normalizeWorkspaceCompanyOption(value: unknown): ResearchWorkspaceCompanyOption | null {
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

function hasResolvedCompanyLabel(company: ResearchWorkspaceCompanyOption): boolean {
  const normalizedName = company.name.trim()

  return normalizedName.length > 0 && normalizedName !== company.id
}

function upsertWorkspaceCompanyOption(
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

async function resolveWorkspaceCompanies(
  session: CustomSession | null,
  source: JsonObject | null,
  projects: ResearchProject[]
): Promise<ResearchWorkspaceCompanyOption[]> {
  const companiesMap = new Map<string, ResearchWorkspaceCompanyOption>()

  asArray(getValue(source, ['companies', 'availableCompanies', 'companyScopes']))
    .map((item) => normalizeWorkspaceCompanyOption(item))
    .filter((item): item is ResearchWorkspaceCompanyOption => item !== null)
    .forEach((company) => upsertWorkspaceCompanyOption(companiesMap, company))

  projects.forEach((project) => {
    if (!project.companyId) {
      return
    }

    upsertWorkspaceCompanyOption(companiesMap, {
      id: project.companyId,
      name: project.companyName || project.companyId,
    })
  })

  const unresolvedCompanyIds = Array.from(companiesMap.values())
    .filter((company) => !hasResolvedCompanyLabel(company))
    .map((company) => company.id)

  if (unresolvedCompanyIds.length === 0 || !session) {
    return Array.from(companiesMap.values())
  }

  if (session.user?.role === 'admin') {
    const companiesResult = await getCompanies(session)

    if ('data' in companiesResult) {
      companiesResult.data.forEach((company) => {
        if (unresolvedCompanyIds.includes(company.id) && company.name) {
          upsertWorkspaceCompanyOption(companiesMap, {
            id: company.id,
            name: company.name,
          })
        }
      })
    }

    return Array.from(companiesMap.values())
  }

  const myCompanyResult = await getMyCompany(session)

  if (
    'data' in myCompanyResult &&
    unresolvedCompanyIds.includes(myCompanyResult.data.id) &&
    myCompanyResult.data.name
  ) {
    upsertWorkspaceCompanyOption(companiesMap, {
      id: myCompanyResult.data.id,
      name: myCompanyResult.data.name,
    })
  }

  return Array.from(companiesMap.values())
}

function normalizeProjectMember(
  value: unknown,
  permissions: ResearchProjectPermissionSet
): ResearchProjectMember | null {
  const source = asObject(value)
  if (!source) {
    return null
  }

  const userSource = asObject(getValue(source, ['user', 'member', 'profile', 'principalInvestigator']))
  const userProfileSource = asObject(getValue(userSource, ['profile', 'user']))
  const membershipId = getString(source, ['id', '_id'])
  const userId =
    getString(source, ['userId']) ||
    getString(userSource, ['userId', 'id', '_id']) ||
    getString(userProfileSource, ['userId', 'id', '_id']) ||
    membershipId

  if (!userId) {
    return null
  }

  const name =
    getString(source, ['name', 'fullName'], '') ||
    getString(userSource, ['name', 'fullName'], '') ||
    getString(userProfileSource, ['name', 'fullName'], '') ||
    userId

  const email =
    getString(source, ['email'], '') ||
    getString(userSource, ['email'], '') ||
    getString(userProfileSource, ['email'], '')

  return {
    id: membershipId || userId,
    userId,
    name,
    email,
    role: getString(source, ['roleInProject', 'role'], 'scientist'),
    grants: getStringArray(source, ['grants', 'capabilities']),
    createdAt: getNullableString(source, ['createdAt', 'joinedAt']),
    canRemove: permissions.canManageMembers,
  }
}

function normalizeCohort(value: unknown): ResearchProjectCohort | null {
  const source = asObject(value)
  if (!source) {
    return null
  }

  const dateRangeSource = asObject(getValue(source, ['dateRange']))

  return {
    groupIds: getStringArray(source, ['groupIds', 'groups']),
    userSelectionMode: getString(source, ['userSelectionMode', 'selectionMode'], 'all'),
    from: getNullableString(dateRangeSource, ['from']) ?? getNullableString(source, ['from', 'startsAt']),
    to: getNullableString(dateRangeSource, ['to']) ?? getNullableString(source, ['to', 'endsAt']),
    resolvedGroupIds: getStringArray(source, ['resolvedGroupIds', 'resolvedGroups']),
  }
}

function normalizeGrant(value: unknown): ResearchProjectGrant | null {
  const source = asObject(value)
  if (!source) {
    return null
  }

  const id = getString(source, ['id', '_id']) || `grant-${Math.random().toString(36).slice(2, 10)}`
  const dateRangeSource = asObject(getValue(source, ['dateRange']))
  const allowedContracts = getStringArray(source, ['allowedContracts', 'contracts'])

  return {
    id,
    title: getString(source, ['title', 'name', 'label'], allowedContracts[0] ?? id),
    allowedContracts,
    allowedFields: getStringArray(source, ['allowedFields', 'fields']),
    allowedTargets: getStringArray(source, ['allowedTargets', 'targets']),
    groupIds: getStringArray(source, ['groupIds', 'groups']),
    userSelectionMode: getString(source, ['userSelectionMode', 'selectionMode'], 'all'),
    pseudonymizationMode: getString(source, ['pseudonymizationMode', 'pseudonymization'], 'required'),
    from: getNullableString(dateRangeSource, ['from']) ?? getNullableString(source, ['from']),
    to: getNullableString(dateRangeSource, ['to']) ?? getNullableString(source, ['to']),
    exportAllowed: getBoolean(source, ['exportAllowed'], false),
    createdAt: getNullableString(source, ['createdAt']),
  }
}

function normalizeDataset(value: unknown): ResearchDataset | null {
  const source = asObject(value)
  if (!source) {
    return null
  }

  const id = getString(source, ['id', '_id', 'field'])
  if (!id) {
    return null
  }

  return {
    id,
    label: getString(source, ['label', 'name', 'title'], id),
    description: getString(source, ['description']),
    status: getString(source, ['status'], 'available'),
    defaultAccess: getString(source, ['defaultAccess', 'accessMode'], 'pseudonymous'),
  }
}

function normalizeModelRun(value: unknown): ResearchModelRun | null {
  const source = asObject(value)
  if (!source) {
    return null
  }

  const id = getString(source, ['id', '_id'])
  if (!id) {
    return null
  }

  return {
    id,
    label: getString(source, ['label', 'name', 'title'], id),
    status: getString(source, ['status'], 'completed') as ResearchModelRunStatus,
    modelVersion: getString(source, ['modelVersion', 'version']),
    completedAt: getNullableString(source, ['completedAt', 'updatedAt']),
  }
}

function normalizeAuditEvents(value: unknown): ResearchAuditEvent[] {
  return asArray(value)
    .map((item) => {
      const source = asObject(item)
      if (!source) {
        return null
      }

      const id = getString(source, ['id', '_id', 'createdAt'])
      if (!id) {
        return null
      }

      const detailsValue = getValue(source, ['details', 'payload', 'metadata'])

      return {
        id,
        eventType: getString(source, ['eventType', 'type'], 'unknown'),
        actorUserId: getString(source, ['actorUserId', 'actorId'], 'system'),
        route: getString(source, ['route'], '/research/v1'),
        createdAt: getString(source, ['createdAt'], ''),
        details: stringifyValue(detailsValue),
        metadata: flattenRecord(detailsValue),
      }
    })
    .filter((item): item is ResearchAuditEvent => item !== null)
}

function mapAuditEventsToAlerts(events: ResearchAuditEvent[]) {
  return events.slice(0, 3).map((event) => ({
    id: event.id,
    severity: event.eventType.toLowerCase().includes('deny')
      ? ('warning' as ResearchAuditSeverity)
      : ('info' as ResearchAuditSeverity),
    title: event.eventType,
    text: event.details,
  }))
}

function normalizeInspection(
  value: unknown,
  query: ResearchMLInspectionQuery | undefined
): ResearchMLInspection | null {
  if (value === null) {
    return null
  }

  const source = asObject(value)
  if (!source) {
    return null
  }

  const governanceSource = asObject(getValue(source, ['governance', 'governanceMetadata', 'metadata']))

  return {
    target: getString(source, ['target'], query?.target ?? ''),
    targetId: getNullableString(source, ['targetId']),
    modelVersion: getNullableString(source, ['modelVersion']),
    contract: getNullableString(source, ['contract', 'allowedContract']),
    governanceMetadata: flattenRecord(governanceSource ?? source),
    payload: source,
  }
}

function normalizeHistoryItem(value: unknown, index: number): ResearchHistoryDatasetItem | null {
  const source = asObject(value)
  if (!source) {
    return null
  }

  const id = getString(source, ['id', '_id'], `history-${index}`)
  const subjectId = getString(source, ['subjectId'], 'N/A')
  const cohort = stringifyValue(getValue(source, ['cohort'])) || 'N/A'

  const from = getNullableString(source, ['from'])
  const to = getNullableString(source, ['to'])
  const dateRange = getString(source, ['dateRange'], [from, to].filter(Boolean).join(' - ') || '')
  const diagnostics = stringifyValue(getValue(source, ['diagnostics'])) || ''

  const fields = Object.entries(source).reduce<Record<string, string>>((accumulator, [key, item]) => {
    if (['id', '_id', 'subjectId', 'cohort', 'from', 'to', 'dateRange', 'diagnostics'].includes(key)) {
      return accumulator
    }

    accumulator[key] = stringifyValue(item)
    return accumulator
  }, {})

  return {
    id,
    subjectId,
    cohort,
    dateRange,
    diagnostics,
    fields,
    raw: source,
  }
}

function normalizeHistoryDataset(value: unknown): ResearchHistoryDataset {
  const source = asObject(value)
  const itemsSource = asArray(getValue(source, ['items', 'data', 'rows']) ?? value)
  const items = itemsSource
    .map((item, index) => normalizeHistoryItem(item, index))
    .filter((item): item is ResearchHistoryDatasetItem => item !== null)

  const columnSet = new Set<string>()
  items.forEach((item) => {
    Object.keys(item.fields).forEach((column) => columnSet.add(column))
  })

  return {
    items,
    columns: Array.from(columnSet),
    total: source ? getNumber(source, ['total'], items.length) : items.length,
  }
}

function normalizeExportResponse(
  value: unknown,
  projectId: string,
  request: ResearchExportRequest
): ResearchExportResponse {
  const source = asObject(value)
  const status = getString(source, ['status'], 'pending_review')
  const format = getString(source, ['format'], request.format) as ResearchExportFormat
  const defaultFileName = `research-export-${projectId}.${format === 'csv' ? 'csv' : 'json'}`
  const contentValue = getValue(source, ['content', 'payload', 'data'])
  const content = format === 'csv' ? stringifyValue(contentValue) : stringifyValue(contentValue || source)

  return {
    status: status === 'ready' ? 'ready' : 'pending_review',
    format,
    fileName: getString(source, ['fileName', 'filename'], defaultFileName),
    content,
    metadata: flattenRecord(source),
  }
}

function normalizeProject(source: JsonObject | null, session: CustomSession | null): ResearchProject {
  const companySource = asObject(getValue(source, ['company']))
  const role = toRole(getNullableString(source, ['currentUserRole', 'role']))
  const permissions = derivePermissions(role, session?.user?.role === 'admin', source)
  const metadata = flattenRecord(getValue(source, ['metadata']))
  const cohort = normalizeCohort(getValue(source, ['cohort', 'currentCohort']))
  const auditEvents = normalizeAuditEvents(getValue(source, ['audit', 'auditEvents', 'events']))
  const diagnosticsSource = asObject(getValue(source, ['latestInspection', 'diagnostics']))

  return {
    id: getString(source, ['id', '_id']),
    name: getString(source, ['name', 'title']),
    description: getString(source, ['description'], getString(source, ['objective'])),
    objective: getString(source, ['objective'], getString(source, ['description'])),
    status: getString(source, ['status'], 'draft') as ResearchProjectStatus,
    approvalStatus: getString(source, ['approvalStatus', 'approval_state'], 'draft') as ResearchApprovalStatus,
    exportPolicy: getString(source, ['exportPolicy', 'export_policy'], 'review_required') as ResearchExportPolicy,
    pseudonymizationMode: getString(
      source,
      ['pseudonymizationMode', 'pseudonymization_mode'],
      'required'
    ) as ResearchPseudonymizationMode,
    principalInvestigatorId: getString(source, ['principalInvestigatorId', 'principal_investigator_id', 'piUserId']),
    retentionUntil: getNullableString(source, ['retentionUntil']),
    consentMode: getString(source, ['consentMode'], 'company_boundary_only') as ResearchConsentMode,
    companyId: getString(source, ['companyId', 'company_id'], getString(companySource, ['id', '_id'])),
    companyName: getString(source, ['companyName'], getString(companySource, ['name'], '')),
    currentUserRole: role,
    permissions,
    createdAt: getNullableString(source, ['createdAt']),
    updatedAt: getNullableString(source, ['updatedAt']),
    metadata,
    startsAt: getString(source, ['startsAt', 'from'], cohort?.from ?? ''),
    endsAt: getString(source, ['endsAt', 'to'], cohort?.to ?? ''),
    targetCohort: getString(source, ['targetCohort', 'cohortName', 'target'], ''),
    cohortSize: getNumber(source, ['cohortSize', 'subjectCount', 'participantsCount'], 0),
    rawMlFeaturesAllowed: getBoolean(source, ['rawMlFeaturesAllowed'], false),
    exportAllowed: getBoolean(source, ['exportAllowed'], permissions.canRequestExports),
    pseudonymizationRequired: getBoolean(
      source,
      ['pseudonymizationRequired'],
      getString(source, ['pseudonymizationMode'], 'required') === 'required'
    ),
    availableGroups: asArray(getValue(source, ['availableGroups', 'groups']))
      .map((item) => normalizeProjectGroup(item))
      .filter((item): item is ResearchProjectGroup => item !== null),
    selectedGroupIds: cohort?.groupIds ?? getStringArray(source, ['groupIds', 'selectedGroupIds']),
    inclusionRules: getStringArray(source, ['inclusionRules']),
    members: asArray(getValue(source, ['members']))
      .map((item) => normalizeProjectMember(item, permissions))
      .filter((item): item is ResearchProjectMember => item !== null),
    grantsList: asArray(getValue(source, ['grants', 'grantsList']))
      .map((item) => normalizeGrant(item))
      .filter((item): item is ResearchProjectGrant => item !== null),
    cohort,
    availableDatasets: asArray(getValue(source, ['datasets', 'availableDatasets']))
      .map((item) => normalizeDataset(item))
      .filter((item): item is ResearchDataset => item !== null),
    latestModelRuns: asArray(getValue(source, ['modelRuns', 'latestModelRuns']))
      .map((item) => normalizeModelRun(item))
      .filter((item): item is ResearchModelRun => item !== null),
    exportJob: {
      id: getString(asObject(getValue(source, ['exportJob'])), ['id', '_id'], EMPTY_EXPORT_JOB.id),
      status: getString(asObject(getValue(source, ['exportJob'])), ['status'], EMPTY_EXPORT_JOB.status),
      format: getString(asObject(getValue(source, ['exportJob'])), ['format'], EMPTY_EXPORT_JOB.format),
      requestedAt: getNullableString(asObject(getValue(source, ['exportJob'])), ['requestedAt']),
      completedAt: getNullableString(asObject(getValue(source, ['exportJob'])), ['completedAt']),
    },
    auditAlerts: mapAuditEventsToAlerts(auditEvents),
    exportAuditLog: auditEvents.map((item) => `${item.createdAt} · ${item.eventType} · ${item.details}`),
    diagnostics: {
      ...EMPTY_DIAGNOSTICS,
      modelVersion: getString(diagnosticsSource, ['modelVersion']),
      riskScore: getString(diagnosticsSource, ['riskScore']),
      anomalyScore: getString(diagnosticsSource, ['anomalyScore']),
      adaptiveRisk: getString(diagnosticsSource, ['adaptiveRisk']),
      modelHealth: getString(diagnosticsSource, ['modelHealth']),
      rawFeatureVector: getStringArray(diagnosticsSource, ['rawFeatureVector']),
      auditLog: auditEvents.map((item) => `${item.createdAt} · ${item.eventType}`),
    },
  }
}

function toResearchProjectMutationBody(payload: Partial<ResearchProjectMutationInput>): Record<string, unknown> {
  return pickDefinedEntries([
    ['companyId', normalizeOptionalPayloadString(payload.companyId)],
    ['name', normalizeOptionalPayloadString(payload.name)],
    ['description', normalizeOptionalPayloadString(payload.description)],
    ['objective', normalizeOptionalPayloadString(payload.objective)],
    ['status', payload.status],
    ['principalInvestigatorId', normalizeOptionalPayloadString(payload.principalInvestigatorId)],
    ['retentionUntil', normalizeOptionalPayloadString(payload.retentionUntil)],
    ['approvalStatus', payload.approvalStatus],
    ['exportPolicy', payload.exportPolicy],
    ['pseudonymizationMode', payload.pseudonymizationMode],
    ['consentMode', payload.consentMode],
  ])
}

function toResearchProjectCohortBody(payload: ResearchProjectCohortInput): Record<string, unknown> {
  return pickDefinedEntries([
    ['groupIds', payload.groupIds],
    ['userSelectionMode', payload.userSelectionMode],
    ['pseudonymizationMode', payload.pseudonymizationMode ?? undefined],
    ['from', normalizeOptionalPayloadString(payload.from)],
    ['to', normalizeOptionalPayloadString(payload.to)],
  ])
}

function toResearchProjectGrantBody(payload: ResearchProjectGrantInput): Record<string, unknown> {
  return pickDefinedEntries([
    ['allowedContracts', payload.allowedContracts],
    ['allowedFields', payload.allowedFields],
    ['allowedTargets', payload.allowedTargets],
    ['groupIds', payload.groupIds],
    ['userSelectionMode', payload.userSelectionMode],
    ['pseudonymizationMode', payload.pseudonymizationMode],
    ['from', normalizeOptionalPayloadString(payload.from)],
    ['to', normalizeOptionalPayloadString(payload.to)],
    ['exportAllowed', payload.exportAllowed],
  ])
}

function unwrapCollection(value: unknown, keys: string[]): unknown[] {
  if (Array.isArray(value)) {
    return value
  }

  const source = asObject(value)
  if (!source) {
    return []
  }

  return asArray(getValue(source, keys))
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  })

  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

function getResearchWorkspaceAccessCacheKey(session: CustomSession | null): string | null {
  const token = session?.OAuthToken?.trim()
  if (!token) {
    return null
  }

  return `${session?.user?.id ?? session?.user?.email ?? 'anonymous'}:${token}`
}

async function performResearchRequest<T = unknown>(
  session: CustomSession | null,
  path: string,
  options?: { method?: string; body?: Record<string, unknown> }
): Promise<{ data: T } | { error: string; status?: number }> {
  const response = await performAuthRequest<T>(session, `${RESEARCH_BASE_URL}${path}`, options)

  if ('error' in response) {
    return { error: response.error, status: response.status }
  }

  return { data: response.data as T }
}

export function hasResearchCapability(access: ResearchWorkspaceAccess | null): boolean {
  return Boolean(access?.hasAccess)
}

export async function getResearchProjects(session: CustomSession | null): Result<ResearchProject[]> {
  const response = await performResearchRequest<unknown>(session, '')

  if ('error' in response) {
    return response
  }

  const projects = unwrapCollection(response.data, ['items', 'projects', 'data'])
    .map((item) => normalizeProject(asObject(item), session))
    .filter((item) => Boolean(item.id))

  return { data: projects }
}

export async function createResearchProject(
  session: CustomSession | null,
  payload: ResearchProjectMutationInput
): Result<ResearchProject> {
  const response = await performResearchRequest<unknown>(session, '', {
    method: 'POST',
    body: toResearchProjectMutationBody(payload),
  })

  if ('error' in response) {
    return response
  }

  return { data: normalizeProject(asObject(response.data), session) }
}

export async function getResearchProjectById(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProject> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}`)

  if ('error' in response) {
    return response
  }

  return { data: normalizeProject(asObject(response.data), session) }
}

export async function updateResearchProject(
  session: CustomSession | null,
  projectId: string,
  payload: Partial<ResearchProjectMutationInput>
): Result<ResearchProject> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}`, {
    method: 'PATCH',
    body: toResearchProjectMutationBody(payload),
  })

  if ('error' in response) {
    return response
  }

  return { data: normalizeProject(asObject(response.data), session) }
}

export async function getResearchProjectMembers(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProjectMember[]> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/members`)

  if ('error' in response) {
    return response
  }

  const members = unwrapCollection(response.data, ['items', 'members', 'data'])
    .map((item) => normalizeProjectMember(item, EMPTY_PERMISSIONS))
    .filter((item): item is ResearchProjectMember => item !== null)

  return { data: members }
}

export async function addResearchProjectMember(
  session: CustomSession | null,
  projectId: string,
  payload: { userId: string; role: ResearchWorkspaceRole }
): Result<ResearchProjectMember> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/members`, {
    method: 'POST',
    body: payload,
  })

  if ('error' in response) {
    return response
  }

  const member = normalizeProjectMember(response.data, EMPTY_PERMISSIONS)
  if (!member) {
    return { error: 'Failed to normalize project member' }
  }

  return { data: member }
}

export async function removeResearchProjectMember(
  session: CustomSession | null,
  projectId: string,
  userId: string
): Result<{ ok: true }> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/members/${userId}`, {
    method: 'DELETE',
  })

  if ('error' in response) {
    return response
  }

  return { data: { ok: true } }
}

export async function getResearchProjectCohort(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProjectCohort | null> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/cohorts`)

  if ('error' in response) {
    return response
  }

  const source = Array.isArray(response.data) ? response.data[0] : response.data
  return { data: normalizeCohort(source) }
}

export async function updateResearchProjectCohort(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchProjectCohortInput
): Result<ResearchProjectCohort | null> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/cohorts`, {
    method: 'PATCH',
    body: toResearchProjectCohortBody(payload),
  })

  if ('error' in response) {
    return response
  }

  return { data: normalizeCohort(response.data) }
}

export async function getResearchProjectGrants(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProjectGrant[]> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/grants`)

  if ('error' in response) {
    return response
  }

  const grants = unwrapCollection(response.data, ['items', 'grants', 'data'])
    .map((item) => normalizeGrant(item))
    .filter((item): item is ResearchProjectGrant => item !== null)

  return { data: grants }
}

export async function createResearchProjectGrant(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchProjectGrantInput
): Result<ResearchProjectGrant> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/grants`, {
    method: 'POST',
    body: toResearchProjectGrantBody(payload),
  })

  if ('error' in response) {
    return response
  }

  const grant = normalizeGrant(response.data)
  if (!grant) {
    return { error: 'Failed to normalize research grant' }
  }

  return { data: grant }
}

export async function getResearchProjectMLInspection(
  session: CustomSession | null,
  projectId: string,
  query?: ResearchMLInspectionQuery
): Result<ResearchMLInspection | null> {
  const response = await performResearchRequest<unknown>(
    session,
    `/${projectId}/ml/inspection${buildQuery({
      target: query?.target,
      targetId: query?.targetId,
      modelVersion: query?.modelVersion,
    })}`
  )

  if ('error' in response) {
    return response
  }

  return { data: normalizeInspection(response.data, query) }
}

export async function getResearchProjectHistoryDataset(
  session: CustomSession | null,
  projectId: string,
  filters: ResearchHistoryDatasetFilters = {}
): Result<ResearchHistoryDataset> {
  const response = await performResearchRequest<unknown>(
    session,
    `/${projectId}/datasets/history${buildQuery({
      from: filters.from,
      to: filters.to,
      limit: filters.limit,
    })}`
  )

  if ('error' in response) {
    return response
  }

  return { data: normalizeHistoryDataset(response.data) }
}

export async function requestResearchProjectExport(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchExportRequest
): Result<ResearchExportResponse> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/exports`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })

  if ('error' in response) {
    return response
  }

  return { data: normalizeExportResponse(response.data, projectId, payload) }
}

export async function getResearchProjectAudit(
  session: CustomSession | null,
  projectId: string
): Result<ResearchAuditEvent[]> {
  const response = await performResearchRequest<unknown>(session, `/${projectId}/audit`)

  if ('error' in response) {
    return response
  }

  return { data: normalizeAuditEvents(getValue(asObject(response.data), ['items', 'data', 'events']) ?? response.data) }
}

export async function getResearchWorkspaceAccess(session: CustomSession | null): Result<ResearchWorkspaceAccess> {
  const cacheKey = getResearchWorkspaceAccessCacheKey(session)
  const existingRequest = cacheKey ? inFlightResearchWorkspaceAccessRequests.get(cacheKey) : undefined

  if (existingRequest) {
    return existingRequest
  }

  const requestPromise: Promise<ResultValue<ResearchWorkspaceAccess>> = (async () => {
    const response = await performResearchRequest<unknown>(session, '')

    if ('error' in response) {
      if (response.status === 403 && !isResearchCompanyBoundaryNotDefined(response.error)) {
        return {
          data: {
            hasAccess: false,
            canCreateProjects: false,
            capabilities: [],
            companies: [],
            scientists: [],
          },
        }
      }

      return response
    }

    const source = asObject(response.data)
    const capabilities = getStringArray(source, ['capabilities', 'workspaceCapabilities']).filter(
      (item): item is ResearchWorkspaceCapability => item === 'scientist' || item === 'research_admin'
    )
    const projects = unwrapCollection(response.data, ['items', 'projects', 'data'])
      .map((item) => normalizeProject(asObject(item), session))
      .filter((item) => Boolean(item.id))
    const companies = await resolveWorkspaceCompanies(session, source, projects)

    const canCreateProjects =
      session?.user?.role === 'admin' ||
      getBoolean(source, ['canCreateProject', 'createProjectAllowed'], false) ||
      projects.some((project) => project.permissions.canCreateProject) ||
      capabilities.includes('research_admin')

    return {
      data: {
        hasAccess: true,
        canCreateProjects,
        capabilities,
        companies,
        scientists: [],
      },
    }
  })()

  if (cacheKey) {
    inFlightResearchWorkspaceAccessRequests.set(cacheKey, requestPromise)
  }

  try {
    return await requestPromise
  } finally {
    if (cacheKey && inFlightResearchWorkspaceAccessRequests.get(cacheKey) === requestPromise) {
      inFlightResearchWorkspaceAccessRequests.delete(cacheKey)
    }
  }
}
