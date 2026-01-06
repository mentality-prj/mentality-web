import React, { useState } from 'react'
import { BookPlus } from 'lucide-react'

import { publishTip } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { notifyError, notifySuccess } from '@/utils/toast'

interface Props {
  id: string
  session: CustomSession | null
  onPublished?: (id: string) => void
  className?: string
}

export default function PublishTipButton({ id, session, onPublished, className = '' }: Props) {
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    if (!session || isPublishing) return
    setIsPublishing(true)
    const result = await publishTip(session, id)
    setIsPublishing(false)
    if ('error' in result) {
      notifyError(String(result.error ?? 'Unknown error'))
    } else {
      notifySuccess('Опубліковано')
      onPublished?.(id)
    }
  }

  return (
    <button
      type="button"
      aria-label="Опублікувати"
      title="Опублікувати"
      onClick={handlePublish}
      disabled={isPublishing}
      className={`tool-icon ${className}`}
    >
      <BookPlus size={12} />
    </button>
  )
}
