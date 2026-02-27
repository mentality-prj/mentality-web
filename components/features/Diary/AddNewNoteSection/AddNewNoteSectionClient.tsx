'use client'

import { useRouter } from 'next/navigation'

import { UserTag } from '@/types/tags'

import { AddNewNote } from '../AddNewNote/AddNewNote'

interface Props {
  availableTags?: UserTag[]
}

export const AddNewNoteSectionClient = ({ availableTags = [] }: Props) => {
  const router = useRouter()

  const handleSave = () => {
    router.refresh()
  }
  return <AddNewNote availableTags={availableTags} onSave={handleSave} />
}
