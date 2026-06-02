import { AccessScopeEntity } from '@/types/company'

function isAccessScopeRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeAccessScope(value: unknown, companyId?: string): AccessScopeEntity | null {
  if (!isAccessScopeRecord(value)) {
    return null
  }

  const id = typeof value.id === 'string' ? value.id : typeof value._id === 'string' ? value._id : ''
  const userId = typeof value.userId === 'string' ? value.userId : ''
  const groupId =
    typeof value.groupId === 'string'
      ? value.groupId
      : Array.isArray(value.groupIds) && typeof value.groupIds[0] === 'string'
        ? value.groupIds[0]
        : ''

  if (!id || !userId || !groupId) {
    return null
  }

  const hasViewAnalytics = value.permission === 'VIEW_ANALYTICS' || value.canViewAnalytics === true
  if (!hasViewAnalytics) {
    return null
  }

  return {
    id,
    userId,
    groupId,
    permission: 'VIEW_ANALYTICS',
    companyId: typeof value.companyId === 'string' ? value.companyId : companyId,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : '',
  }
}

export function normalizeAccessScopes(value: unknown, companyId?: string): AccessScopeEntity[] {
  return Array.isArray(value)
    ? value
        .map((item) => normalizeAccessScope(item, companyId))
        .filter((item): item is AccessScopeEntity => item !== null)
    : []
}
