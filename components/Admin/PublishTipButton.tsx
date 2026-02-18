import React, { useState } from 'react'
import { BookPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { publishTip } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { Button } from '@/ui/button'
import { notifyError, notifySuccess } from '@/utils/toast'

interface Props {
  id: string
  session: CustomSession | null
  onPublished?: (id: string) => void
  className?: string
}

export default function PublishTipButton({ id, session, onPublished, className = '' }: Props) {
  const t = useTranslations('common.Buttons')
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    if (!session || isPublishing) return
    setIsPublishing(true)
    const result = await publishTip(session, id)
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
