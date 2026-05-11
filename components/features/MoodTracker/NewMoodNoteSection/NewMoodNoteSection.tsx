import { getServerSession } from '@/lib/get-server-session'
import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import { getLastMoodRecords } from '@/requests/moodRecord'
import type { UserTag } from '@/types/tags'

import NewMoodNoteSectionClient from './NewMoodNoteSectionClient'

export async function NewMoodNoteSection() {
  const session = await getServerSession()
  const [tagsRes, lastRecordRes] = await Promise.all([
    fetchNormalizedUserTags(session),
    getLastMoodRecords(session, { limit: 1 }),
  ])

  const tags: UserTag[] = !('error' in tagsRes) && Array.isArray(tagsRes.data) ? tagsRes.data : []

  const lastRecord = !('error' in lastRecordRes) ? (lastRecordRes.data?.[0] ?? null) : null
  const initialLastSubmittedAt = lastRecord?.createdAt ?? null

  return <NewMoodNoteSectionClient availableTags={tags} initialLastSubmittedAt={initialLastSubmittedAt} />
}

export default NewMoodNoteSection
