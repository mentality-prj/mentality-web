'use client'

import { useRouter } from 'next/navigation'

import type { UserTag } from '@/types/tags'

import AddNewMood from '../AddNewMood/AddNewMood'

interface Props {
  availableTags?: UserTag[]
}

export const NewMoodNoteSectionClient = ({ availableTags = [] }: Props) => {
  const router = useRouter()

  const handleSave = () => {
    router.refresh()
  }

  return <AddNewMood availableTags={availableTags} onSave={handleSave} />
}

export default NewMoodNoteSectionClient
