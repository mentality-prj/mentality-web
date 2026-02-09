'use client'

import GetUserTags from '../MoodTracker/GetUserTags/GetUserTags'

import { AddNewNote } from './AddNewNote'

export default function AddNewNoteClient() {
  // TODO:Rework as in the NewMoodNoteSection file
  return <GetUserTags>{(tags) => <AddNewNote availableTags={tags} />}</GetUserTags>
}
