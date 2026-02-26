'use client'

import { DiaryEntity } from '@/types/api-responses'
import { UserTag } from '@/types/tags'

import { UserNotesCard } from '../UserNotesCard'

type Props = {
  notes: DiaryEntity[]
  availableTags: UserTag[]
}

export function UserNotesList({ notes, availableTags }: Props) {
  return (
    <div className="grid gap-sm">
      {notes.map((note) => (
        <UserNotesCard key={note.id} {...note} availableTags={availableTags} />
      ))}
    </div>
  )
}
