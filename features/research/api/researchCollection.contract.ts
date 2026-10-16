import { z } from 'zod'

const collectionItem = z.record(z.unknown())
const collectionSchema = z.array(collectionItem)
const entityId = z.union([z.string().trim().min(1), z.number().finite()])

function hasFirstValidId(record: Record<string, unknown>, keys: readonly string[]): boolean {
  const key = keys.find((name) => Object.prototype.hasOwnProperty.call(record, name))
  return key ? entityId.safeParse(record[key]).success : false
}

function isValidCompany(value: unknown): boolean {
  if (entityId.safeParse(value).success) return true

  const object = collectionItem.safeParse(value)
  return object.success && hasFirstValidId(object.data, ['id', '_id', 'companyId'])
}

const companyList = z.array(z.unknown()).refine((values) => values.every(isValidCompany))

const projectKeys = ['items', 'projects', 'data'] as const

const workspaceMetadataSchema = z
  .object({
    capabilities: z.array(z.string()).optional(),
    workspaceCapabilities: z.array(z.string()).optional(),
    canCreateProject: z.boolean().optional(),
    createProjectAllowed: z.boolean().optional(),
    companies: companyList.optional(),
    availableCompanies: companyList.optional(),
    companyScopes: companyList.optional(),
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

  const metadata = workspaceMetadataSchema.safeParse(value)
  if (!metadata.success) return null

  if (projectKeys.some((key) => Object.prototype.hasOwnProperty.call(envelope.data, key))) {
    return decodeResearchCollection(value, projectKeys)
  }

  return workspaceMetadataKeys.some((key) => Object.prototype.hasOwnProperty.call(envelope.data, key)) ? [] : null
}

/**
 * Validate single-entity responses before applying permissive ViewModel
 * normalization. Reject missing or ambiguous IDs rather than manufacturing
 * successful empty projects or random grant identifiers.
 */
export function decodeResearchEntity(value: unknown): Record<string, unknown> | null {
  const parsed = collectionItem.safeParse(value)
  if (!parsed.success || !hasResearchEntityId(parsed.data)) return null
  return parsed.data
}

/** Project and grant list entries must have stable identities. */
export function hasResearchEntityId(item: Record<string, unknown>): boolean {
  return hasFirstValidId(item, ['id', '_id'])
}
