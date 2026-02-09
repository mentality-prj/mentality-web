import type { MoodRecordEntity } from '@/types/api-responses'
import type { UserTag } from '@/types/tags'

import { MoodRecordsClient } from './MoodRecordsClient'

type Props = {
  records: MoodRecordEntity[]
  availableTags?: UserTag[]
}

export function MoodRecordsWrapper({ records, availableTags = [] }: Props) {
  return <MoodRecordsClient records={records} availableTags={availableTags} />
}
