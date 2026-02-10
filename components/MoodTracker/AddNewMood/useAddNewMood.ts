import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import useTags from '@/hooks/useTags'
import { logger } from '@/lib/logger'
import { moodKeyToLevel } from '@/mappers/mood.mappers'
import { createMoodRecord } from '@/requests/moodRecord'
import type { CreateMoodRecordDto } from '@/types/api-responses'
import type { CustomSession } from '@/types/auth'
import { UserTag } from '@/types/tags'
import { extractErrorMessage } from '@/utils/apiError'
import { notifyError, notifySuccess } from '@/utils/toast'

type Params = {
  availableTags?: UserTag[]
  onSave?: () => void
  onClose?: () => void
}

export function useAddNewMood({ availableTags = [], onSave, onClose }: Params) {
  const { data: session } = useSession()
  const t = useTranslations('components.Mood')

  const safeT = (k: string, fallback: string) => {
    try {
      return t(k)
    } catch (err) {
      logger.warn('Missing translation key', { key: k, error: err })
      return fallback
    }
  }

  const [selectedMood, setSelectedMood] = useState<string | null>(null)
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
  const [stressLevel, setStressLevel] = useState<number | undefined>()
  const [formKey, setFormKey] = useState(0)

  const resetForm = () => {
    setSelectedMood(null)
    setNote('')
    clearSelectedTags()
    setStressLevel(undefined)
    setShowAddTag(false)
    setFormKey((prev) => prev + 1)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting) return
    if (!selectedMood) {
      notifyError(safeT('Validation.SelectMood', 'Please select a mood'))
      return
    }

    if (!session?.user) {
      notifyError(safeT('Validation.NotSignedIn', 'You must be signed in to save a mood'))
      return
    }

    setIsSubmitting(true)
    try {
      const moodLevel = moodKeyToLevel(selectedMood)
      const dto: CreateMoodRecordDto = {
        moodLevel: moodLevel!,
        description: note || undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        stressLevel: typeof stressLevel === 'number' ? stressLevel : undefined,
        active: true,
      }

      const result = await createMoodRecord(session as unknown as CustomSession | null, dto)
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, safeT('Toast.Failed', 'Failed to save mood')))
        return
      }

      notifySuccess(safeT('Toast.Saved', 'Mood saved'))
      resetForm()
      if (onSave) onSave()
      if (onClose) onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    selectedMood,
    setSelectedMood,
    note,
    setNote,
    stressLevel,
    setStressLevel,
    selectedTags,
    addTag,
    removeTag,
    localAvailableTags,
    tagLabels,
    showAddTag,
    setShowAddTag,
    isSubmitting,
    handleSubmit,
    onTagCreated,
    formKey,
  }
}

export default useAddNewMood
