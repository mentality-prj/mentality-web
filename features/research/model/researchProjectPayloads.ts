import type {
  ResearchProjectCohortInput,
  ResearchProjectGrantInput,
  ResearchProjectMutationInput,
} from '@/types/research'

import {
  asArray,
  asObject,
  getValue,
  normalizeOptionalPayloadString,
  pickDefinedEntries,
} from './researchProjectPrimitives'

export function toResearchProjectMutationBody(payload: Partial<ResearchProjectMutationInput>): Record<string, unknown> {
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

export function toResearchProjectCohortBody(payload: ResearchProjectCohortInput): Record<string, unknown> {
  return pickDefinedEntries([
    ['groupIds', payload.groupIds],
    ['userSelectionMode', payload.userSelectionMode],
    ['pseudonymizationMode', payload.pseudonymizationMode ?? undefined],
    ['from', normalizeOptionalPayloadString(payload.from)],
    ['to', normalizeOptionalPayloadString(payload.to)],
  ])
}

export function toResearchProjectGrantBody(payload: ResearchProjectGrantInput): Record<string, unknown> {
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

export function unwrapCollection(value: unknown, keys: string[]): unknown[] {
  if (Array.isArray(value)) {
    return value
  }

  const source = asObject(value)
  if (!source) {
    return []
  }

  return asArray(getValue(source, keys))
}
