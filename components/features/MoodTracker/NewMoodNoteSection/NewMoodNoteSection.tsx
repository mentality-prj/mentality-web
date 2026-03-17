import { auth } from '@/auth'
import { fetchUserTagsCached } from '@/lib/userTagsCache'
import { getLastMoodRecords } from '@/requests/moodRecord'
import type { UserTag } from '@/types/tags'

import NewMoodNoteSectionClient from './NewMoodNoteSectionClient'

export async function NewMoodNoteSection() {
  const session = await auth()
  const [tagsRes, lastRecordRes] = await Promise.all([
    fetchUserTagsCached(session),
    getLastMoodRecords(session, { limit: 1 }),
  ])

  let tags: UserTag[] = []
  if (!('error' in tagsRes) && Array.isArray(tagsRes.data)) {
    tags = (tagsRes.data as Array<Partial<UserTag>>)
      .filter((t) => !!t?.key)
      .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))
  }

  const lastRecord = !('error' in lastRecordRes) ? (lastRecordRes.data?.[0] ?? null) : null
  const initialLastSubmittedAt = lastRecord?.createdAt ?? null

  return <NewMoodNoteSectionClient availableTags={tags} initialLastSubmittedAt={initialLastSubmittedAt} />
}

export default NewMoodNoteSection
