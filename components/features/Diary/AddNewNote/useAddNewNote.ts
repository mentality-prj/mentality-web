import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import useTags from '@/hooks/useTags'
import { authService } from '@/lib/auth'
import { logger } from '@/lib/logger'
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

    setIsSubmitting(true)
    try {
      // The protected page can be server-authenticated before AuthProvider has
      // hydrated after a real Zitadel redirect. Recheck the existing BFF
      // session instead of dropping the user's draft without issuing a POST.
      // Only verified user metadata reaches the browser; JWTs remain HttpOnly.
      const verifiedSession = session?.user ? session : null
      const user = verifiedSession?.user ?? (await authService.getUser())
      if (!user) {
        notifyError(t('notAuthenticated'))
        return
      }

      const dto: CreateDiaryDto = {
        content: note,
        tags: selectedTags,
        isActive: false,
      }
      const result = await createDiary(verifiedSession ?? { user }, dto)

      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, t('saveError')))
        return
      }

      notifySuccess(t('saveSuccess'))
      resetForm()
      // The diary entry is persisted; a refresh failure must not be shown as a failed save.
      try {
        onSave?.()
        onClose?.()
      } catch (error) {
        logger.warn('Diary saved but post-save UI update failed', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    } catch (error) {
      logger.error('Diary submission failed unexpectedly', {
        error: error instanceof Error ? error.message : String(error),
      })
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
