import {
  normalizeAuditEvents,
  normalizeGrant,
  normalizeProjectMember,
} from '@/features/research/model/researchProjectEntities'
import { EMPTY_PERMISSIONS } from '@/features/research/model/researchProjectPrimitives'
import type { ResearchProjectGrant, ResearchProjectMember } from '@/types/research'

import { decodeResearchCollection, hasResearchEntityId } from './researchCollection.contract'

const projectsError = 'Invalid research projects response from backend'
const membersError = 'Invalid research members response from backend'
const grantsError = 'Invalid research grants response from backend'
const auditError = 'Invalid research audit response from backend'

export function decodeResearchProjectsResponse(value: unknown) {
  const projects = decodeResearchCollection(value, ['items', 'projects', 'data'])
  if (!projects || !projects.every(hasResearchEntityId)) {
    return { success: false as const, error: projectsError }
  }
  return { success: true as const, data: projects }
}

export function decodeResearchMembersResponse(value: unknown) {
  const items = decodeResearchCollection(value, ['items', 'members', 'data'])
  if (!items) return { success: false as const, error: membersError }

  const members = items.map((item) => normalizeProjectMember(item, EMPTY_PERMISSIONS))
  if (members.some((member) => member === null)) {
    return { success: false as const, error: membersError }
  }
  return { success: true as const, data: members.filter((item): item is ResearchProjectMember => item !== null) }
}

export function decodeResearchGrantsResponse(value: unknown) {
  const items = decodeResearchCollection(value, ['items', 'grants', 'data'])
  if (!items || !items.every(hasResearchEntityId)) {
    return { success: false as const, error: grantsError }
  }

  const grants = items.map((item) => normalizeGrant(item))
  if (grants.some((grant) => grant === null)) {
    return { success: false as const, error: grantsError }
  }
  return { success: true as const, data: grants.filter((item): item is ResearchProjectGrant => item !== null) }
}

/** Preserve all-or-nothing audit decoding and event metadata projection. */
export function decodeResearchAuditResponse(value: unknown) {
  const events = decodeResearchCollection(value, ['items', 'data', 'events'])
  if (!events) return { success: false as const, error: auditError }

  const audit = normalizeAuditEvents(events)
  if (audit.length !== events.length) return { success: false as const, error: auditError }
  return { success: true as const, data: audit }
}
