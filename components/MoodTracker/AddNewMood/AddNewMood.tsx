'use client'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import CloseIconButton from '@/components/Buttons/CloseIconButton'
import FormCard from '@/components/Cards/FormCard'
import StyledTextarea from '@/components/Forms/StyledTextarea'
import AddNewTag from '@/components/MoodTracker/AddNewTag/AddNewTag'
import Tag from '@/components/Tag/Tag'
import { Button } from '@/ds/shadcn/button'
import { UserTag } from '@/types/tags'

import FullScreenBackdrop from '../../FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { MOODS } from '../moods'

import useAddNewMood from './useAddNewMood'

interface AddNewMoodProps {
  onClose: () => void
  onSave: () => void
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
  } = useAddNewMood({ availableTags, onSave, onClose })

  return (
    <FormCard
      title={tm('title')}
      tools={<CloseIconButton onClick={onClose} className="ml-4 h-7 w-7" />}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting}
      onCancel={onClose}
      submitLabel={ct('save')}
      className="p-6"
    >
      <div className="flex flex-col gap-6">
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

        <div className="flex flex-col gap-2">
          <h5>{tm('describe')}</h5>
          <StyledTextarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={tm('placeholderNote')} />
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((t) => (
                <Tag key={t} text={tagLabels[t as string] ?? t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h5>{tm('addTags')}</h5>

          <div className="flex items-center justify-between">
            <div className="mt-2 flex flex-wrap gap-2">
              {localAvailableTags.map((t) => (
                <Tag key={t.key} text={tagLabels[t.key] ?? t.name ?? t.key} onClick={() => addTag(t.key)} />
              ))}
            </div>
            <Button variant="ghost" size="small" onClick={() => setShowAddTag(true)}>
              <PlusIcon size={12} />
              {tt('addNewTag.add')}
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

        <div>
          <h5>{tm('chooseStress')}</h5>
          <div className="w-full rounded-lg bg-gray-50 p-4">[стрічка рівня стресу]</div>
        </div>
      </div>
    </FormCard>
  )
}

export default AddNewMood
