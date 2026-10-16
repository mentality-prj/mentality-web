import {
  decodeResearchWorkspaceProjects,
  hasResearchEntityId,
} from '@/features/research/api/researchCollection.contract'
import { asObject } from '@/features/research/model/researchProjectPrimitives'

const INVALID_WORKSPACE_RESPONSE = 'Invalid research workspace response from backend'

/**
 * Decode workspace entitlements before deriving capabilities or permissions.
 * Preserve the supported metadata-only and array payloads; invalid 2xx
 * responses must not be interpreted as authorized workspaces.
 */
export function decodeResearchWorkspaceResponse(value: unknown) {
  const projects = decodeResearchWorkspaceProjects(value)
  if (!projects || !projects.every(hasResearchEntityId)) {
    return { success: false as const, error: INVALID_WORKSPACE_RESPONSE }
  }

  return {
    success: true as const,
    data: {
      source: asObject(value),
      projects,
    },
  }
}
