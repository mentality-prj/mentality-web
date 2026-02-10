import { auth } from '@/auth'
import { fetchUserTagsCached } from '@/lib/userTagsCache'
import type { UserTag } from '@/types/tags'

import { AddNewNote } from './AddNewNote'

export default async function AddNewNoteClient() {
  const session = await auth()
  const res = await fetchUserTagsCached(session)

  let tags: UserTag[] = []
  if (!('error' in res) && Array.isArray(res.data)) {
    tags = (res.data as Array<Partial<UserTag>>)
      .filter((t) => !!t?.key)
      .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))
  }

  return <AddNewNote availableTags={tags} />
}
