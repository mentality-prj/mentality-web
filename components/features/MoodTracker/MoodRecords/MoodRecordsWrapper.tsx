import type { MoodRecordEntity } from '@/types/api-responses'
import type { UserTag } from '@/types/tags'

import { MoodRecordsClient } from './MoodRecordsClient'

type Props = {
  records: MoodRecordEntity[]
  availableTags?: UserTag[]
  totalCount?: number
}

export function MoodRecordsWrapper({ records, availableTags = [], totalCount }: Props) {
  const effectiveTotalCount = totalCount ?? records.length
  return <MoodRecordsClient totalCount={effectiveTotalCount} records={records} availableTags={availableTags} />
}
