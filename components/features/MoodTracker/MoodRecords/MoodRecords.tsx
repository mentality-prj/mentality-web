import { getServerSession } from '@/lib/get-server-session'
import { fetchUserTagsCached } from '@/lib/userTagsCache'
import type { MoodRecordEntity } from '@/types/api-responses'

import { MoodRecordsContainer } from './MoodRecordsContainer'

type Props = {
  records?: MoodRecordEntity[]
  totalCount?: number
}

export async function MoodRecords({ records, totalCount }: Props) {
  const session = await getServerSession()
  const res = await fetchUserTagsCached(session)

  let tags = []
  if (!('error' in res) && Array.isArray(res.data)) {
    tags = res.data
  }

  return <MoodRecordsContainer totalCount={totalCount} records={records ?? []} availableTags={tags} />
}
