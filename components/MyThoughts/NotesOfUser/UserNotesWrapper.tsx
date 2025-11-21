import { getUserNotes } from '@/actions/notes.action'

import { UserNotes } from './UserNotes'

export async function UserNotesWrapper() {
  const notes = await getUserNotes()
  console.log('notes in UserNotesWrapper', notes)
  return <UserNotes notes={notes} />
}
