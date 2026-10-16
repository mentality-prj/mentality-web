import { z } from 'zod'

const collectionItem = z.record(z.unknown())
const collectionSchema = z.array(collectionItem)
const entityId = z.union([z.string().trim().min(1), z.number().finite()])

const projectKeys = ['items', 'projects', 'data'] as const

const workspaceMetadataSchema = z
  .object({
    capabilities: z.array(z.string()).optional(),
    workspaceCapabilities: z.array(z.string()).optional(),
    canCreateProject: z.boolean().optional(),
    createProjectAllowed: z.boolean().optional(),
    companies: z.array(z.unknown()).optional(),
    availableCompanies: z.array(z.unknown()).optional(),
    companyScopes: z.array(z.unknown()).optional(),
  })
  .passthrough()

const workspaceMetadataKeys = [
  'capabilities',
  'workspaceCapabilities',
  'canCreateProject',
  'createProjectAllowed',
  'companies',
  'availableCompanies',
  'companyScopes',
] as const

/**
 * A missing list or an invalid member is a contract failure, not an empty list.
 * The first present alias wins, matching the existing Research API behavior.
 */
export function decodeResearchCollection(value: unknown, keys: readonly string[]): Record<string, unknown>[] | null {
  let items: unknown = value

  if (!Array.isArray(value)) {
    const envelope = collectionItem.safeParse(value)
    if (!envelope.success) return null

    const key = keys.find((candidate) => Object.prototype.hasOwnProperty.call(envelope.data, candidate))
    if (!key) return null

    items = envelope.data[key]
  }

  const result = collectionSchema.safeParse(items)
  return result.success ? result.data : null
}

/** Workspace access may return entitlement metadata without a projects list. */
export function decodeResearchWorkspaceProjects(value: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(value)) return decodeResearchCollection(value, projectKeys)

  const envelope = collectionItem.safeParse(value)
  if (!envelope.success) return null

  if (projectKeys.some((key) => Object.prototype.hasOwnProperty.call(envelope.data, key))) {
    return decodeResearchCollection(value, projectKeys)
  }

  const metadata = workspaceMetadataSchema.safeParse(value)
  if (!metadata.success) return null

  return workspaceMetadataKeys.some((key) => Object.prototype.hasOwnProperty.call(envelope.data, key)) ? [] : null
}

/** Project and grant list entries must have stable identities. */
export function hasResearchEntityId(item: Record<string, unknown>): boolean {
  return entityId.safeParse(item.id).success || entityId.safeParse(item._id).success
}
