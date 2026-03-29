import { GroupEntity } from '@/types/company'

function safeString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return String(value)
}

export function mapGroup(input: unknown): GroupEntity | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>

  const id = safeString(obj.id ?? obj._id ?? '')
  if (!id) return null

  const children = Array.isArray(obj.children)
    ? obj.children.map(mapGroup).filter((c): c is GroupEntity => c !== null)
    : []

  return {
    id,
    name: safeString(obj.name),
    companyId: safeString(obj.companyId),
    parentId: obj.parentId != null ? safeString(obj.parentId) : null,
    children,
    createdAt: safeString(obj.createdAt),
    updatedAt: safeString(obj.updatedAt),
  }
}

export function mapGroups(input: unknown): GroupEntity[] {
  if (!input) return []
  if (Array.isArray(input)) return input.map(mapGroup).filter((g): g is GroupEntity => g !== null)
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (Array.isArray(obj.items)) return mapGroups(obj.items)
    if (Array.isArray(obj.data)) return mapGroups(obj.data)
  }
  return []
}

/**
 * Flatten a tree of groups into a flat list (depth-first).
 */
export function flattenGroups(groups: GroupEntity[]): GroupEntity[] {
  return groups.flatMap((g) => [g, ...flattenGroups(g.children)])
}
