import type { MoodRecordEntity } from '@/types/api-responses'
import type { UserTag } from '@/types/tags'

import { MoodRecordsClient } from './MoodRecordsClient'

type Props = {
  records: MoodRecordEntity[]
  availableTags?: UserTag[]
  totalCount?: number
}

export function MoodRecordsWrapper({ records, availableTags = [], totalCount = 1 }: Props) {
  return <MoodRecordsClient totalCount={totalCount} records={records} availableTags={availableTags} />
}
