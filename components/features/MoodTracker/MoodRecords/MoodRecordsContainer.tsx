import type { MoodRecordEntity } from '@/types/api-responses'
import type { UserTag } from '@/types/tags'

import { MoodRecordsWrapper } from './MoodRecordsWrapper'

type Props = {
  records: MoodRecordEntity[]
  availableTags?: UserTag[]
  totalCount?: number
}

export function MoodRecordsContainer({ records, availableTags = [], totalCount }: Props) {
  return <MoodRecordsWrapper totalCount={totalCount} records={records} availableTags={availableTags} />
}
