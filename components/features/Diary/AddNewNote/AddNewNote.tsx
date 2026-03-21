'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import AddNewTag from '@/components/features/AddNewTag/AddNewTag'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import StyledTextarea from '@/components/shared/Forms/StyledTextarea'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { USER_NOTE_LENGTH_LIMIT } from '@/constants/userNote'
import { Tag } from '@/ds/components/Tag'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import useAddNewNote from './useAddNewNote'

interface AddNewNoteProps {
  onClose?: () => void
  onSave?: () => void
  availableTags?: UserTag[]
}

export const AddNewNote = ({ onClose, onSave, availableTags = [] }: AddNewNoteProps) => {
  const t = useTranslations('components.Diary.AddNewNote')
  const tt = useTranslations('components.Tags')
  const [isMaxLengthReached, setIsMaxLengthReached] = useState(false)

  const {
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
  } = useAddNewNote({ availableTags, onSave, onClose })

  const tools = onClose && <CloseIconButton onClick={onClose} />

  return (
    <FormCard
      title={t('title')}
      tools={tools}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid || isSubmitting}
      onCancel={onClose}
      submitLabel={t('submitLabel')}
      className="p-6"
    >
      <div className="flex flex-col gap-default">
        <div className="flex flex-col gap-xs">
          <StyledTextarea
            id="diary-note"
            name="note"
            value={note}
            placeholder={t('textareaPlaceholder', { max: USER_NOTE_LENGTH_LIMIT })}
            spellCheck={true}
            maxLength={USER_NOTE_LENGTH_LIMIT}
            onChange={(e) => {
              const value = e.target.value
              setNote(value)
              setIsMaxLengthReached(value.length === USER_NOTE_LENGTH_LIMIT)
            }}
          />
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-xs">
              {selectedTags.map((t) => (
                <Tag key={t} text={tagLabels[t as string] ?? t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
          {isMaxLengthReached && (
            <span className="text-sm text-textcolor-muted">
              {t('maxLengthReached', { max: USER_NOTE_LENGTH_LIMIT })}
            </span>
          )}
        </div>
        <div>
          <h5>{t('addTag')}</h5>

          <div className="relative flex items-center justify-between">
            <div className="mt-2 flex flex-wrap gap-xs">
              {localAvailableTags.map((t) => (
                <Tag key={t.key} text={tagLabels[t.key] ?? t.name ?? t.key} onClick={() => addTag(t.key)} />
              ))}
            </div>
            <div className="relative">
              <Button variant="ghost" size="small" onClick={() => setShowAddTag(true)}>
                <PlusIcon size={12} />
                {tt('addNewTag.add')}
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
