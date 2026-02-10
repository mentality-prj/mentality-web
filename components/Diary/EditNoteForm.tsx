'use client'
import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Tag } from '@/ds/components/Tag'

import { Button } from '../../ds/shadcn/button'
import useTags from '../../hooks/useTags'
import { useRouter } from '../../i18n/navigation'
import { getDiaryById, updateDiary } from '../../requests/diary'
import { UpdateDiaryDto } from '../../types/api-responses'
import { UserTag } from '../../types/tags'
import extractErrorMessage from '../../utils/apiError'
import { notifyError, notifySuccess } from '../../utils/toast'
import FormCard from '../Cards/FormCard'
import StyledTextarea from '../Forms/StyledTextarea'
import FullScreenBackdrop from '../FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import AddNewTag from '../MoodTracker/AddNewTag/AddNewTag'

type Props = {
  idNote: string
  availableTags: UserTag[]
  onClose: () => void
}

export const EditNoteForm = ({ availableTags = [], idNote, onClose }: Props) => {
  const { data: session } = useSession()
  const te = useTranslations('components.Diary.EditNoteForm')
  const ta = useTranslations('components.Diary.AddNewNote')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const {
    selectedTags,
    setSelectedTags,
    localAvailableTags,
    tagLabels,
    showAddTag,
    setShowAddTag,
    addTag,
    removeTag,
    onTagCreated,
    clearSelectedTags,
  } = useTags({ availableTags })

  useEffect(() => {
    if (!session?.user) return
    let isMounted = true

    const loadNote = async () => {
      const result = await getDiaryById(session, idNote)
      if (!isMounted) return
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, te('loadError')))
        return
      }

      if (!result.data) {
        notifyError(te('notFoundError'))
        return
      }

      setNote(result.data.content)
      setSelectedTags(result.data.tags ?? [])
    }
    loadNote()
    return () => {
      isMounted = false
    }
  }, [idNote, session, setSelectedTags, te])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting) return
    if (!note.trim()) {
      notifyError(te('inputError'))
      return
    }
    if (!session?.user) {
      notifyError(te('notAuthenticated'))
      return
    }
    setIsSubmitting(true)
    let isSuccess = false
    try {
      const dto: UpdateDiaryDto = {
        content: note,
        tags: selectedTags,
        isActive: false,
      }
      const result = await updateDiary(session, idNote, dto)
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, te('updateError')))
        return
      }
      notifySuccess(te('success'))
      isSuccess = true
    } finally {
      setIsSubmitting(false)
      if (isSuccess) {
        clearSelectedTags()
        setNote('')
        onClose()
        router.refresh()
      }
    }
  }

  return (
    <FormCard title={te('title')} submitLabel={te('submitLabel')} submitDisabled={isSubmitting} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <StyledTextarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={ta('textareaPlaceholder')}
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
          <h5>{ta('addTag')}</h5>

          <div className="relative flex items-center justify-between">
            <div className="mt-2 flex flex-wrap gap-2">
              {localAvailableTags.map((t) => (
                <Tag key={t.key} text={tagLabels[t.key] ?? t.name ?? t.key} onClick={() => addTag(t.key)} />
              ))}
            </div>
            <div className="relative">
              <Button variant="ghost" size="small" onClick={() => setShowAddTag(true)}>
                <PlusIcon size={12} />
                {ta('addNewTag')}
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
