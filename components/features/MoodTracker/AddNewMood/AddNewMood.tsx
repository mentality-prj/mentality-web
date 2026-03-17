'use client'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import AddNewTag from '@/components/features/AddNewTag/AddNewTag'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { MOODS } from '@/constants/moods'
import { Tag } from '@/ds/components/Tag'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import { EnergyAssessment } from '../EnergyAssessment/EnergyAssessment'
import { FocusAssessment } from '../FocusAssessment/FocusAssessment'
import { StressAssessment } from '../StressAssessment/StressAssessment'

import useAddNewMood from './useAddNewMood'

interface AddNewMoodProps {
  onClose?: () => void
  onSave?: () => void
  availableTags?: UserTag[]
  initialLastSubmittedAt?: string | null
}

const AddNewMood = ({ onClose, onSave, availableTags = [], initialLastSubmittedAt }: AddNewMoodProps) => {
  const tm = useTranslations('components.Mood')
  const ct = useTranslations('common.Buttons')
  const tt = useTranslations('components.Tags')
  const mn = useTranslations('components.Mood')

  const {
    selectedMood,
    setSelectedMood,
    stressLevel,
    setStressLevel,
    energyLevel,
    setEnergyLevel,
    focusLevel,
    setFocusLevel,
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
  } = useAddNewMood({ availableTags, onSave, onClose, initialLastSubmittedAt })

  const tools = onClose && <CloseIconButton onClick={onClose} />

  if (submittedToday) {
    return (
      <FormCard
        title={tm('title')}
        tools={tools}
        onSubmit={handleSubmit}
        submitDisabled
        onCancel={onClose}
        submitLabel={ct('save')}
        className="p-6 max-md:w-[100%] max-md:p-4"
      >
        <p className="text-sm text-textcolor-secondary">{tm('DailyLimit.Message')}</p>
      </FormCard>
    )
  }

  return (
    <FormCard
      title={tm('title')}
      tools={tools}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid || isSubmitting}
      onCancel={onClose}
      submitLabel={ct('save')}
      className="p-6 max-md:w-[100%] max-md:p-4"
    >
      <div className="flex flex-col gap-default">
        <h5>{tm('howAreYou')}</h5>
        <div className="grid grid-cols-5 px-4 max-lg:px-0" style={{ gridAutoColumns: 'max-content' }}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.key

            return (
              <div key={mood.key} className="flex flex-col items-center justify-between py-5 text-center">
                <Button
                  size="iconXL"
                  variant="iconButton"
                  className={`${isSelected ? 'rounded-full ring-4 ring-sky-400/30' : ''}`}
                  onClick={() => setSelectedMood(mood.key)}
                  aria-pressed={isSelected}
                  aria-label={tm(mood?.key as string)}
                  title={tm(mood?.key as string)}
                >
                  <mood.icon />
                </Button>
                <span className="text-textcolor-tertiary mt-2 text-xs font-normal max-md:hidden">{mn(mood.label)}</span>
              </div>
            )
          })}
        </div>

        <div className="flex gap-sm max-md:flex-col">
          <StressAssessment key={`stress-${formKey}`} value={stressLevel} onChange={(v) => setStressLevel(v)} />
          <EnergyAssessment key={`energy-${formKey}`} value={energyLevel} onChange={(v) => setEnergyLevel(v)} />
          <FocusAssessment key={`focus-${formKey}`} value={focusLevel} onChange={(v) => setFocusLevel(v)} />
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-xs">
            {selectedTags.map((t) => (
              <Tag key={t} text={tagLabels[t as string] ?? t} onRemove={() => removeTag(t)} />
            ))}
          </div>
        )}

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
