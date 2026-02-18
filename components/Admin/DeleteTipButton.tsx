import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { deleteTip } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { Button } from '@/ui/button'
import { notifyError, notifySuccess } from '@/utils/toast'

interface Props {
  id: string
  session: CustomSession | null
  onDeleted?: (id: string) => void
  className?: string
}

export default function DeleteTipButton({ id, session, onDeleted, className = '' }: Props) {
  const t = useTranslations('common.Buttons')
  const ta = useTranslations('components.Admin.GenerateAffirmation')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!session || isDeleting) return
    if (!confirm('Видалити пораду?')) return
    setIsDeleting(true)
    const result = await deleteTip(session, id)
    setIsDeleting(false)
    if ('error' in result) {
      notifyError(String(result.error ?? 'Unknown error'))
    } else {
      notifySuccess(ta('deleted'))
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
