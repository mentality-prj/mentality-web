import { DiaryEntity } from '@/types/api-responses'
import { UserTag } from '@/types/tags'

import { UserNotesClient } from './UserNotesClient'

type Props = {
  notes: DiaryEntity[]
  availableTags?: UserTag[]
}

export function UserNotesWrapper({ notes, availableTags = [] }: Props) {
  return <UserNotesClient notes={notes} availableTags={availableTags} />
}
