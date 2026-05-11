import { getServerSession } from '@/lib/get-server-session'
import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import type { MoodRecordEntity } from '@/types/api-responses'
import type { UserTag } from '@/types/tags'

import { MoodRecordsContainer } from './MoodRecordsContainer'

type Props = {
  records?: MoodRecordEntity[]
  totalCount?: number
}

export async function MoodRecords({ records, totalCount }: Props) {
  const session = await getServerSession()
  const res = await fetchNormalizedUserTags(session)

  const tags: UserTag[] = !('error' in res) && Array.isArray(res.data) ? res.data : []

  return <MoodRecordsContainer totalCount={totalCount} records={records ?? []} availableTags={tags} />
}
