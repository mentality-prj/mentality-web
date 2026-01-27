import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { moodKeyToLevel } from '@/helpers/moodMapper'
import { createMoodRecord } from '@/requests/moodRecord'
import type { CreateMoodRecordDto } from '@/types/api-responses'
import type { CustomSession } from '@/types/auth'
import { UserTag } from '@/types/tags'
import { extractErrorMessage } from '@/utils/apiError'
import { notifyError, notifySuccess } from '@/utils/toast'

type Params = {
  availableTags?: UserTag[]
  onSave: () => void
  onClose: () => void
}

export function useAddNewMood({ availableTags = [], onSave, onClose }: Params) {
  const { data: session } = useSession()
  const t = useTranslations('components.Mood')

  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [localAvailableTags, setLocalAvailableTags] = useState<UserTag[]>(availableTags)
  const [tagLabels, setTagLabels] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    availableTags.forEach((t) => {
      if (t && t.key && t.name) map[t.key] = t.name
    })
    return map
  })
  const [showAddTag, setShowAddTag] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setLocalAvailableTags(availableTags)
    setTagLabels(() => {
      const map: Record<string, string> = {}
      availableTags.forEach((t) => {
        if (t && t.key && t.name) map[t.key] = t.name
      })
      return map
    })
  }, [availableTags])

  useEffect(() => {
    setTagLabels((prev) => {
      const next: Record<string, string> = {}
      localAvailableTags.forEach((k) => {
        if (prev[k.key]) next[k.key] = prev[k.key]
      })
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAvailableTags])

  const addTag = (t: string) => {
    setSelectedTags((prev) => (prev.includes(t) ? prev : [...prev, t]))
  }

  const removeTag = (t: string) => {
    setSelectedTags((prev) => prev.filter((x) => x !== t))
  }

  const onTagCreated = ({ key, name }: { key: string; name: string }) => {
    setLocalAvailableTags((prev) => (prev.some((x) => x.key === key) ? prev : [...prev, { key, name }]))
    setTagLabels((prev) => ({ ...prev, [key]: name }))
    addTag(key)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting) return
    if (!selectedMood) {
      notifyError(t('Validation.SelectMood'))
      return
    }

    if (!session?.user) {
      notifyError(t('Validation.NotSignedIn'))
      return
    }

    setIsSubmitting(true)
    try {
      const moodLevel = moodKeyToLevel(selectedMood)
      const dto: CreateMoodRecordDto = {
        moodLevel: moodLevel!,
        description: note || undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        // stressLevel: undefined,
        active: true,
      }

      const result = await createMoodRecord(session as unknown as CustomSession | null, dto)
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, t('Toast.Failed')))
        return
      }

      notifySuccess(t('Toast.Saved'))
      onSave()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    selectedMood,
    setSelectedMood,
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
    handleSubmit,
    onTagCreated,
  }
}

export default useAddNewMood
