'use client'

import { useRouter } from 'next/navigation'

import type { UserTag } from '@/types/tags'

import AddNewMood from '../AddNewMood/AddNewMood'

interface Props {
  availableTags?: UserTag[]
  initialLastSubmittedAt?: string | null
  timeZone?: string | null
  historyVerified?: boolean
}

export const NewMoodNoteSectionClient = ({
  availableTags = [],
  initialLastSubmittedAt,
  timeZone,
  historyVerified,
}: Props) => {
  const router = useRouter()

  const handleSave = () => {
    router.refresh()
  }

  return (
    <div className="w-full wide:w-auto">
      <AddNewMood
        availableTags={availableTags}
        onSave={handleSave}
        initialLastSubmittedAt={initialLastSubmittedAt}
        timeZone={timeZone}
        historyVerified={historyVerified}
      />
    </div>
  )
}

export default NewMoodNoteSectionClient
