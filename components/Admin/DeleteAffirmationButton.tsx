import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { deleteAffirmation } from '@/requests/affirmations'
import { CustomSession } from '@/types/auth'
import { notifyError, notifySuccess } from '@/utils/toast'

interface Props {
  id: string
  session: CustomSession | null
  onDeleted?: (id: string) => void
  className?: string
}

export default function DeleteAffirmationButton({ id, session, onDeleted, className = '' }: Props) {
  const t = useTranslations('common.Buttons')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!session || isDeleting) return
    if (!confirm('Видалити афірмацію?')) return
    setIsDeleting(true)
    const result = await deleteAffirmation(session, id)
    setIsDeleting(false)
    if ('error' in result) {
      notifyError(String(result.error ?? 'Unknown error'))
    } else {
      notifySuccess('Видалено')
      onDeleted?.(id)
    }
  }

  return (
    <Button
      variant="iconTool"
      aria-label={t('delete')}
      title={t('delete')}
      onClick={handleDelete}
      disabled={isDeleting}
      className={className}
    >
      <Trash size={12} />
    </Button>
  )
}
