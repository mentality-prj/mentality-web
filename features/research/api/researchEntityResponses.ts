import { decodeResearchEntity } from '@/features/research/api/researchCollection.contract'
import { normalizeGrant, normalizeProjectMember } from '@/features/research/model/researchProjectEntities'
import { EMPTY_PERMISSIONS } from '@/features/research/model/researchProjectPrimitives'

const invalidProject = 'Invalid research project response from backend'
const invalidGrant = 'Invalid research grant response from backend'
const invalidMember = 'Failed to normalize project member'

/**
 * Decode untrusted write responses at the same boundary as Research reads.
 * Do not allow an invalid success payload to create a phantom entity.
 */
export function decodeResearchProjectResponse(value: unknown) {
  const project = decodeResearchEntity(value)
  if (!project) return { success: false as const, error: invalidProject }
  return { success: true as const, data: project }
}

export function decodeResearchGrantResponse(value: unknown) {
  const entity = decodeResearchEntity(value)
  if (!entity) return { success: false as const, error: invalidGrant }
  const grant = normalizeGrant(entity)
  if (!grant) return { success: false as const, error: invalidGrant }
  return { success: true as const, data: grant }
}

export function decodeResearchMemberResponse(value: unknown) {
  const member = normalizeProjectMember(value, EMPTY_PERMISSIONS)
  if (!member) return { success: false as const, error: invalidMember }
  return { success: true as const, data: member }
}
