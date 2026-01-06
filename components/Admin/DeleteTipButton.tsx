import React, { useState } from 'react'
import { Trash } from 'lucide-react'

import { deleteTip } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { notifyError, notifySuccess } from '@/utils/toast'

interface Props {
  id: string
  session: CustomSession | null
  onDeleted?: (id: string) => void
  className?: string
}

export default function DeleteTipButton({ id, session, onDeleted, className = '' }: Props) {
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
      notifySuccess('Видалено')
      onDeleted?.(id)
    }
  }

  return (
    <button
      type="button"
      aria-label="Видалити"
      title="Видалити"
      onClick={handleDelete}
      disabled={isDeleting}
      className={`tool-icon ${className}`}
    >
      <Trash size={12} />
    </button>
  )
}
