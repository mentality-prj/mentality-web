import { getUserNotes } from '@/actions/notes.action'

import { UserNotes } from './UserNotes'

export async function UserNotesWrapper() {
  const notes = await getUserNotes()
  return <UserNotes notes={notes} />
}
