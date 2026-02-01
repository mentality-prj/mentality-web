'use client'

import AddNewMood from '../AddNewMood/AddNewMood'
import GetUserTags from '../GetUserTags/GetUserTags'

export const NewMoodNoteSection = () => {
  return <GetUserTags>{(tags) => <AddNewMood availableTags={tags} />}</GetUserTags>
}
