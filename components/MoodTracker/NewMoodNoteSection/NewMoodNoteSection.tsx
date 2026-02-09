import { auth } from '@/auth'
import { fetchUserTagsCached } from '@/lib/userTagsCache'
import type { UserTag } from '@/types/tags'

import NewMoodNoteSectionClient from './NewMoodNoteSectionClient'

export async function NewMoodNoteSection() {
  const session = await auth()
  const res = await fetchUserTagsCached(session)

  let tags: UserTag[] = []
  if (!('error' in res) && Array.isArray(res.data)) {
    tags = (res.data as Array<Partial<UserTag>>)
      .filter((t) => !!t?.key)
      .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))
  }

  return <NewMoodNoteSectionClient availableTags={tags} />
}

export default NewMoodNoteSection
