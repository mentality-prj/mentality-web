import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import useTags from '@/hooks/useTags'
import { createDiary } from '@/requests/diary'
import type { CreateDiaryDto } from '@/types/api-responses'
import type { UserTag } from '@/types/tags'
import { extractErrorMessage } from '@/utils/apiError'
import { notifyError, notifySuccess } from '@/utils/toast'

type Params = {
  availableTags?: UserTag[]
  onSave?: () => void
  onClose?: () => void
}

export function useAddNewNote({ availableTags = [], onSave, onClose }: Params) {
  const { session } = useAuth()
  const t = useTranslations('components.Diary.AddNewNote')

  const [note, setNote] = useState('')
  const {
    selectedTags,
    localAvailableTags,
    tagLabels,
    showAddTag,
    setShowAddTag,
    addTag,
    removeTag,
    onTagCreated,
    clearSelectedTags,
  } = useTags({ availableTags })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setNote('')
    clearSelectedTags()
    setShowAddTag(false)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting || !isFormValid) return

    if (!session?.user) {
      notifyError(t('notAuthenticated'))
      return
    }

    setIsSubmitting(true)
    try {
      const dto: CreateDiaryDto = {
        content: note,
        tags: selectedTags,
        isActive: false,
      }
      const result = await createDiary(session, dto)

      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, t('saveError')))
        return
      }

      notifySuccess(t('saveSuccess'))
      resetForm()
      // The write succeeded. A failed router refresh or close callback must not
      // be treated as a failed save or invite a duplicate diary submission.
      try {
        onSave?.()
        onClose?.()
      } catch {
        // The saved record remains authoritative; it will appear on a later refresh.
      }
    } catch {
      // An unexpected transport rejection must preserve the typed note and
      // selected tags, and let the user retry after connectivity returns.
      notifyError(t('saveError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = note.trim().length > 0

  return {
    note,
    setNote,
    selectedTags,
    addTag,
    removeTag,
    localAvailableTags,
    tagLabels,
    showAddTag,
    setShowAddTag,
    isSubmitting,
    isFormValid,
    handleSubmit,
    onTagCreated,
  }
}

export default useAddNewNote
