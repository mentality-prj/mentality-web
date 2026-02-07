'use client'
import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

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
import Tag from '../Tag'

type Props = {
  idNote: string
  availableTags: UserTag[]
  onClose: () => void
}

export const EditNoteForm = ({ availableTags = [], idNote, onClose }: Props) => {
  const { data: session } = useSession()
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
        notifyError(extractErrorMessage(result.error, 'Failed to load note'))
        return
      }

      if (!result.data) {
        notifyError('Note not found')
        return
      }

      setNote(result.data.content)
      setSelectedTags(result.data.tags ?? [])
    }
    loadNote()
    return () => {
      isMounted = false
    }
  }, [idNote, session, setSelectedTags])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting) return
    if (!note.trim()) {
      notifyError('Please input a note')
      console.log('input error')
      return
    }
    if (!session?.user) {
      notifyError('You must be signed in to save a note')
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
        notifyError(extractErrorMessage(result.error, 'Failed to update note'))
        return
      }
      notifySuccess('Note updated')
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
    <FormCard
      title="Зміни запис"
      submitLabel="Зберегти зміни"
      submitDisabled={isSubmitting}
      className=""
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <StyledTextarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Введіть запис" />
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((t) => (
                <Tag key={t} text={tagLabels[t as string] ?? t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </div>
        <div>
          <h5>Додай теги:</h5>

          <div className="flex items-center justify-between">
            <div className="mt-2 flex flex-wrap gap-2">
              {localAvailableTags.map((t) => (
                <Tag key={t.key} text={tagLabels[t.key] ?? t.name ?? t.key} onClick={() => addTag(t.key)} />
              ))}
            </div>
            <Button variant="ghost" size="small" onClick={() => setShowAddTag(true)}>
              <PlusIcon size={12} />
              Додати тег
            </Button>
          </div>

          {showAddTag && (
            <>
              <FullScreenBackdrop onClick={() => setShowAddTag(false)} />
              <div className="absolute inset-0 z-50 flex items-center justify-center">
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
    </FormCard>
  )
}
