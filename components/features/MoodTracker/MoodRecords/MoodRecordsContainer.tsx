import { MoodRecordsFilterProvider } from '@/context/moodRecordsFilterContext'
import type { MoodRecordEntity } from '@/types/api-responses'
import { SORT_ORDER } from '@/types/sort'
import type { UserTag } from '@/types/tags'

import { MoodRecordsWrapper } from './MoodRecordsWrapper'

type Props = {
  records: MoodRecordEntity[]
  availableTags?: UserTag[]
}

export function MoodRecordsContainer({ records, availableTags = [] }: Props) {
  return (
    <MoodRecordsFilterProvider
      initial={{
        order: SORT_ORDER.NEWEST,
        tags: '',
        moodLevel: '',
        stressLevel: '',
        week: '',
      }}
    >
      <MoodRecordsWrapper records={records} availableTags={availableTags} />
    </MoodRecordsFilterProvider>
  )
}
