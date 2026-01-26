import { useState } from 'react'
import { BookPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { publishExercise } from '@/requests/exercises'
import { CustomSession } from '@/types/auth'
import { notifyError, notifySuccess } from '@/utils/toast'

interface Props {
  id: string
  session: CustomSession | null
  onPublished?: (id: string) => void
  className?: string
}

export default function PublishExerciseButton({ id, session, onPublished, className = '' }: Props) {
  const t = useTranslations('common.Buttons')
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    if (!session || isPublishing) return
    setIsPublishing(true)
    const result = await publishExercise(session, id)
    setIsPublishing(false)
    if ('error' in result) {
      notifyError(String(result.error ?? 'Unknown error'))
    } else {
      notifySuccess(t('publish'))
      onPublished?.(id)
    }
  }

  return (
    <Button
      variant="iconTool"
      aria-label={t('publish')}
      title={t('publish')}
      onClick={handlePublish}
      disabled={isPublishing}
      className={className}
    >
      <BookPlus size={12} />
    </Button>
  )
}
