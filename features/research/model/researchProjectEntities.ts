import type { CustomSession } from '@/types/auth'
import type {
  ResearchApprovalStatus,
  ResearchAuditEvent,
  ResearchAuditSeverity,
  ResearchConsentMode,
  ResearchDataset,
  ResearchExportFormat,
  ResearchExportPolicy,
  ResearchExportRequest,
  ResearchExportResponse,
  ResearchHistoryDataset,
  ResearchHistoryDatasetItem,
  ResearchMLInspection,
  ResearchMLInspectionQuery,
  ResearchModelRun,
  ResearchModelRunStatus,
  ResearchProject,
  ResearchProjectCohort,
  ResearchProjectGrant,
  ResearchProjectGroup,
  ResearchProjectMember,
  ResearchProjectPermissionSet,
  ResearchProjectStatus,
  ResearchPseudonymizationMode,
} from '@/types/research'

import {
  asArray,
  asObject,
  derivePermissions,
  EMPTY_DIAGNOSTICS,
  EMPTY_EXPORT_JOB,
  flattenRecord,
  getBoolean,
  getNullableString,
  getNumber,
  getString,
  getStringArray,
  getValue,
  JsonObject,
  normalizeProjectGroup,
  stringifyValue,
  toRole,
} from './researchProjectPrimitives'

export function normalizeProjectMember(
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

export function normalizeCohort(value: unknown): ResearchProjectCohort | null {
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

export function normalizeGrant(value: unknown): ResearchProjectGrant | null {
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

export function normalizeDataset(value: unknown): ResearchDataset | null {
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

export function normalizeModelRun(value: unknown): ResearchModelRun | null {
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

export function normalizeAuditEvents(value: unknown): ResearchAuditEvent[] {
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

export function mapAuditEventsToAlerts(events: ResearchAuditEvent[]) {
  return events.slice(0, 3).map((event) => ({
    id: event.id,
    severity: event.eventType.toLowerCase().includes('deny')
      ? ('warning' as ResearchAuditSeverity)
      : ('info' as ResearchAuditSeverity),
    title: event.eventType,
    text: event.details,
  }))
}

export function normalizeInspection(
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

export function normalizeHistoryItem(value: unknown, index: number): ResearchHistoryDatasetItem | null {
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

export function normalizeHistoryDataset(value: unknown): ResearchHistoryDataset {
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

export function normalizeExportResponse(
  value: unknown,
  projectId: string,
  request: ResearchExportRequest
): ResearchExportResponse {
  const source = asObject(value)
  const status = getString(source, ['status'], 'pending_review')
  const format = getString(source, ['format'], request.format) as ResearchExportFormat
  const defaultFileName = `research-export-${projectId}.${format === 'csv' ? 'csv' : 'json'}`
  const contentValue = getValue(source, ['content', 'payload', 'data'])
  const content = format === 'csv' ? stringifyValue(contentValue) : stringifyValue(contentValue ?? source)

  return {
    status: status === 'ready' ? 'ready' : 'pending_review',
    format,
    fileName: getString(source, ['fileName', 'filename'], defaultFileName),
    content,
    metadata: flattenRecord(source),
  }
}

export function normalizeProject(source: JsonObject | null, session: CustomSession | null): ResearchProject {
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
