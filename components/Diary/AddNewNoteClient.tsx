'use client'

import GetUserTags from '../MoodTracker/GetUserTags/GetUserTags'

import { AddNewNote } from './AddNewNote'

export default function AddNewNoteClient() {
  return <GetUserTags>{(tags) => <AddNewNote availableTags={tags} />}</GetUserTags>
}
