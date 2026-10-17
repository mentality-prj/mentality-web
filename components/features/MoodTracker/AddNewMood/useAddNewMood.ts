import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { isSubmittedToday } from '@/helpers/mood.helpers'
import useTags from '@/hooks/useTags'
import { logger } from '@/lib/logger'
import { moodKeyToLevel } from '@/mappers/mood.mappers'
import { createMoodRecord } from '@/requests/moodRecord'
import type { CreateMoodRecordDto } from '@/types/api-responses'
import type { CustomSession } from '@/types/auth'
import { UserTag } from '@/types/tags'
import { extractErrorMessage } from '@/utils/apiError'
import { getVerifiedBrowserTimeZone } from '@/utils/timeZone'
import { notifyError, notifySuccess } from '@/utils/toast'

type Params = {
  availableTags?: UserTag[]
  onSave?: () => void
  onClose?: () => void
  initialLastSubmittedAt?: string | null
  timeZone?: string | null
  historyVerified?: boolean
}

export function useAddNewMood({
  availableTags = [],
  onSave,
  onClose,
  initialLastSubmittedAt,
  timeZone,
  historyVerified = true,
}: Params) {
  const { session } = useAuth()
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
  const [stressLevel, setStressLevel] = useState<number>(1)
  const [energyLevel, setEnergyLevel] = useState<number>(1)
  const [focusLevel, setFocusLevel] = useState<number>(1)
  const [formKey, setFormKey] = useState(0)
  const [lastSubmittedAt, setLastSubmittedAt] = useState<string | null>(initialLastSubmittedAt ?? null)
  const [browserTimeZone, setBrowserTimeZone] = useState<string | null>(null)

  useEffect(() => {
    const syncTimeZone = () => setBrowserTimeZone(getVerifiedBrowserTimeZone())
    syncTimeZone()
    window.addEventListener('focus', syncTimeZone)
    document.addEventListener('visibilitychange', syncTimeZone)
    return () => {
      window.removeEventListener('focus', syncTimeZone)
      document.removeEventListener('visibilitychange', syncTimeZone)
    }
  }, [])

  const effectiveTimeZone = browserTimeZone ?? timeZone ?? null
  const submittedToday = lastSubmittedAt ? isSubmittedToday(lastSubmittedAt, effectiveTimeZone) : false

  const resetForm = () => {
    setSelectedMood(null)
    clearSelectedTags()
    setStressLevel(1)
    setEnergyLevel(1)
    setFocusLevel(1)
    setShowAddTag(false)
    setFormKey((prev) => prev + 1)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting) return
    // Re-resolve at submission: the device zone may change while the form stays open.
    const submissionTimeZone = getVerifiedBrowserTimeZone() ?? timeZone ?? null
    const submittedOnCurrentDay = lastSubmittedAt ? isSubmittedToday(lastSubmittedAt, submissionTimeZone) : false
    if (submissionTimeZone !== effectiveTimeZone) setBrowserTimeZone(submissionTimeZone)
    if (submittedOnCurrentDay || !submissionTimeZone || !historyVerified) return
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
        tags: selectedTags.length ? selectedTags : undefined,
        stressLevel: stressLevel,
        energyLevel: energyLevel,
        focusLevel: focusLevel,
      }

      const result = await createMoodRecord(session as unknown as CustomSession | null, dto, submissionTimeZone)
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, safeT('Toast.Failed', 'Failed to save mood')))
        return
      }

      setLastSubmittedAt(result.data?.createdAt ?? new Date().toISOString())
      notifySuccess(safeT('Toast.Saved', 'Mood saved'))
      resetForm()
      // The record is already persisted. A UI refresh failure must not be
      // reported as a failed save, which could prompt duplicate submissions.
      try {
        onSave?.()
        onClose?.()
      } catch (error) {
        logger.warn('Mood saved but post-save UI update failed', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    } catch (error) {
      logger.error('Mood record submission failed unexpectedly', {
        error: error instanceof Error ? error.message : String(error),
      })
      notifyError(safeT('Toast.Failed', 'Failed to save mood'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = !!selectedMood && !!effectiveTimeZone && !submittedToday && historyVerified

  return {
    selectedMood,
    setSelectedMood,
    energyLevel,
    setEnergyLevel,
    focusLevel,
    setFocusLevel,
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
    isFormValid,
    submittedToday,
    handleSubmit,
    onTagCreated,
    formKey,
  }
}

export default useAddNewMood
