import { getServerSession } from '@/lib/get-server-session'
import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import type { UserTag } from '@/types/tags'

import { AddNewNoteSectionClient } from './AddNewNoteSectionClient'

export default async function AddNewNoteSection() {
  const session = await getServerSession()
  const res = await fetchNormalizedUserTags(session)

  const tags: UserTag[] = !('error' in res) && Array.isArray(res.data) ? res.data : []

  return <AddNewNoteSectionClient availableTags={tags} />
}
