import { auth } from '@/auth'
import { fetchUserTagsCached } from '@/lib/userTagsCache'
import type { MoodRecordEntity } from '@/types/api-responses'

import { MoodRecordsContainer } from './MoodRecordsContainer'

type Props = {
  records?: MoodRecordEntity[]
}

export async function MoodRecords({ records }: Props) {
  const session = await auth()
  const res = await fetchUserTagsCached(session)

  let tags = []
  if (!('error' in res) && Array.isArray(res.data)) {
    tags = res.data
  }

  return <MoodRecordsContainer records={records ?? []} availableTags={tags} />
}
