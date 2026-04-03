import { ONE_YEAR_MS } from '@/constants/company'
import { GroupEntity } from '@/types/company'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function classifyInviteError(
  error: string,
  t: (key: string) => string
): string {
  const lower = error.toLowerCase()
  if (error.includes('409') || lower.includes('duplicate')) return t('errorDuplicate')
  if (lower.includes('already in company')) return t('errorAlreadyMember')
  return error
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function oneYearAgoStr(): string {
  return new Date(Date.now() - ONE_YEAR_MS).toISOString().slice(0, 10)
}

/**
 * Collects the IDs of all descendants of a group node (i.e. children, grandchildren, etc.).
 */
export function getDescendantIds(group: GroupEntity): Set<string> {
  const ids = new Set<string>()
  function collect(node: GroupEntity) {
    node.children.forEach((c) => {
      ids.add(c.id)
      collect(c)
    })
  }
  collect(group)
  return ids
}

/**
 * Precomputes which tree nodes should be shown during search: a node is visible
 * if it matches the query OR any of its descendants match.
 */
export function computeVisibleSet(groups: GroupEntity[], matchSet: Set<string>): Set<string> {
  const visible = new Set<string>()
  function walk(group: GroupEntity): boolean {
    const selfMatch = matchSet.has(group.id)
    const childMatch = group.children.some(walk)
    if (selfMatch || childMatch) visible.add(group.id)
    return selfMatch || childMatch
  }
  groups.forEach(walk)
  return visible
}
