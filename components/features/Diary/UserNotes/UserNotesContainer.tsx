import { UserNotesFilterProvider } from '@/context/userNotesFilterContext'
import { DiaryEntity } from '@/types/api-responses'
import { SORT_ORDER } from '@/types/sort'
import { UserTag } from '@/types/tags'

import { UserNotesWrapper } from './UserNotesWrapper'

type Props = {
  notes: DiaryEntity[]
  availableTags?: UserTag[]
}

export function UserNotesContainer({ notes, availableTags = [] }: Props) {
  return (
    <UserNotesFilterProvider
      initial={{
        order: SORT_ORDER.NEWEST,
        tags: [],
        weekdays: [],
      }}
    >
      <UserNotesWrapper notes={notes} availableTags={availableTags} />
    </UserNotesFilterProvider>
  )
}
