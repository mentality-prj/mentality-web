'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Button } from '../../ds/shadcn/button'
import useTags from '../../hooks/useTags'
import { useRouter } from '../../i18n/navigation'
import { createDiary } from '../../requests/diary'
import { CreateDiaryDto } from '../../types/api-responses'
import { UserTag } from '../../types/tags'
import extractErrorMessage from '../../utils/apiError'
import { notifyError, notifySuccess } from '../../utils/toast'
import FormCard from '../Cards/FormCard'
import StyledTextarea from '../Forms/StyledTextarea'
import FullScreenBackdrop from '../FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import AddNewTag from '../MoodTracker/AddNewTag/AddNewTag'
import Tag from '../Tag'

interface AddNewNoteProps {
  availableTags?: UserTag[]
}

export const AddNewNote = ({ availableTags = [] }: AddNewNoteProps) => {
  const { data: session } = useSession()
  const t = useTranslations('components.Diary.AddNewNote')
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
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isValid = note.trim().length > 0 && selectedTags.length > 0
  const router = useRouter()

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting || !isValid) return

    if (!session?.user) {
      notifyError(t('notAuthenticated'))
      return
    }
    setIsSubmitting(true)
    let isSuccess = false
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
      isSuccess = true
    } finally {
      setIsSubmitting(false)
      if (isSuccess) {
        clearSelectedTags()
        setNote('')
        router.refresh()
      }
    }
  }
  return (
    <FormCard
      submitDisabled={isSubmitting || !isValid}
      title={t('title')}
      submitLabel={t('submitLabel')}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <StyledTextarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('textareaPlaceholder')}
          />
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((t) => (
                <Tag key={t} text={tagLabels[t as string] ?? t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </div>
        <div>
          <h5>{t('addTag')}</h5>

          <div className="relative flex items-center justify-between">
            <div className="mt-2 flex flex-wrap gap-2">
              {localAvailableTags.map((t) => (
                <Tag key={t.key} text={tagLabels[t.key] ?? t.name ?? t.key} onClick={() => addTag(t.key)} />
              ))}
            </div>
            <div className="relative">
              <Button variant="ghost" size="small" onClick={() => setShowAddTag(true)}>
                <PlusIcon size={12} />
                {t('addNewTag')}
              </Button>

              {showAddTag && (
                <>
                  <FullScreenBackdrop onClick={() => setShowAddTag(false)} />
                  <div className="absolute -top-44 right-0 z-50">
                    <AddNewTag
                      onClose={() => setShowAddTag(false)}
                      onCreated={(t) => {
                        onTagCreated(t)
                        setShowAddTag(false)
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  )
}
