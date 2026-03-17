'use client'

import { useRouter } from 'next/navigation'

import type { UserTag } from '@/types/tags'

import AddNewMood from '../AddNewMood/AddNewMood'

interface Props {
  availableTags?: UserTag[]
  initialLastSubmittedAt?: string | null
}

export const NewMoodNoteSectionClient = ({ availableTags = [], initialLastSubmittedAt }: Props) => {
  const router = useRouter()

  const handleSave = () => {
    router.refresh()
  }

  return (
    <div className="w-full wide:w-auto">
      <div className="m-6 wide:m-0">
        <AddNewMood availableTags={availableTags} onSave={handleSave} initialLastSubmittedAt={initialLastSubmittedAt} />
      </div>
    </div>
  )
}

export default NewMoodNoteSectionClient
