import { getUserTags } from '@/requests/userTags'
import type { CustomSession } from '@/types/auth'
import type { UserTag } from '@/types/tags'

function normalizeUserTag(tag: Partial<UserTag> | null | undefined): UserTag | null {
  if (!tag) {
    return null
  }

  const key = typeof tag.key === 'string' ? tag.key.trim() : ''
  if (!key) {
    return null
  }

  const name = typeof tag.name === 'string' ? tag.name.trim() : ''

  return { key, name }
}

function normalizeUserTags(data: Array<Partial<UserTag>>): UserTag[] {
  return data.reduce<UserTag[]>((tags, tag) => {
    const normalizedTag = normalizeUserTag(tag)

    if (normalizedTag) {
      tags.push(normalizedTag)
    }

    return tags
  }, [])
}

function normalizeUserTagsError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  return 'Failed to fetch user tags'
}

export async function fetchNormalizedUserTags(session: CustomSession | null) {
  try {
    const res = await getUserTags(session)
    if (!('error' in res) && Array.isArray(res.data)) {
      return { data: normalizeUserTags(res.data as Array<Partial<UserTag>>) }
    }
    return res
  } catch (err) {
    return { error: normalizeUserTagsError(err) }
  }
}
