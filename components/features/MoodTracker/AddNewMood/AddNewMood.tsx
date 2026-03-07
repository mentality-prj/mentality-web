'use client'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import AddNewTag from '@/components/features/AddNewTag/AddNewTag'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import StyledTextarea from '@/components/shared/Forms/StyledTextarea'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { MOODS } from '@/constants/moods'
import { Tag } from '@/ds/components/Tag'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import { StressAssessment } from '../StressAssessment/StressAssessment'

import useAddNewMood from './useAddNewMood'

interface AddNewMoodProps {
  onClose?: () => void
  onSave?: () => void
  availableTags?: UserTag[]
}

const AddNewMood = ({ onClose, onSave, availableTags = [] }: AddNewMoodProps) => {
  const tm = useTranslations('components.Mood')
  const ct = useTranslations('common.Buttons')
  const tt = useTranslations('components.Tags')
  const mn = useTranslations('components.Mood')

  const {
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
    isFormValid,
    handleSubmit,
    onTagCreated,
    formKey,
  } = useAddNewMood({ availableTags, onSave, onClose })

  const tools = onClose && <CloseIconButton onClick={onClose} />

  return (
    <FormCard
      title={tm('title')}
      tools={tools}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid || isSubmitting}
      onCancel={onClose}
      submitLabel={ct('save')}
      className="p-6"
    >
      <div className="flex flex-col gap-default">
        <h5>{tm('howAreYou')}</h5>
        <div className="grid grid-cols-5 px-4" style={{ gridAutoColumns: 'max-content' }}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.key

            return (
              <div key={mood.key} className="flex flex-col items-center justify-between py-5 text-center">
                <Button
                  size="iconBig"
                  variant="iconButton"
                  className={`${isSelected ? 'rounded-full ring-4 ring-sky-400/30' : ''}`}
                  onClick={() => setSelectedMood(mood.key)}
                  aria-pressed={isSelected}
                  aria-label={tm(mood?.key as string)}
                  title={tm(mood?.key as string)}
                >
                  <mood.icon />
                </Button>
                <span className="text-textcolor-tertiary mt-2 whitespace-nowrap text-xs font-normal">
                  {mn(mood.label)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-sm wide:flex-row">
          <div className="flex flex-1 flex-col gap-xs">
            <h5>{tm('describe')}</h5>
            <StyledTextarea
              id="mood-note"
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={tm('placeholderNote')}
              className="flex-1"
            />
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-xs">
                {selectedTags.map((t) => (
                  <Tag key={t} text={tagLabels[t as string] ?? t} onRemove={() => removeTag(t)} />
                ))}
              </div>
            )}
          </div>
          <StressAssessment key={formKey} value={stressLevel} onChange={(v) => setStressLevel(v)} />
        </div>

        <div>
          <h5>{tm('addTags')}</h5>

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

export default AddNewMood
