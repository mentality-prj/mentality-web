'use client'
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import AddNewTag from '@/components/features/AddNewTag/AddNewTag'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { type MoodKey, MOODS } from '@/constants/moods'
import { Tag } from '@/ds/components/Tag'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import { EnergyAssessment } from '../EnergyAssessment/EnergyAssessment'
import { FocusAssessment } from '../FocusAssessment/FocusAssessment'
import { MoodInsightGuide } from '../MoodInsightGuide/MoodInsightGuide'
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

  const hoverFiltersByMood: Record<MoodKey, string> = {
    veryBad: 'brightness(1.12) saturate(1.45) contrast(1.08)',
    bad: 'brightness(1.08) saturate(2.2) contrast(1.14)',
    neutral: 'brightness(1.08) saturate(1.18) contrast(1.04)',
    good: 'brightness(1.06) saturate(1.16) contrast(1.05)',
    great: 'brightness(1.1) saturate(1.3) contrast(1.06)',
  }

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
  const isSm = useBreakpoint('sm')
  const [hoveredMoodKey, setHoveredMoodKey] = useState<MoodKey | null>(null)

  const tools = (
    <div className="flex items-center gap-2">
      <MoodInsightGuide />
      {onClose && <CloseIconButton onClick={onClose} />}
    </div>
  )

  if (submittedToday) {
    return (
      <div className="relative">
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
      </div>
    )
  }

  return (
    <div className="relative">
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
              const isHighlighted = isSelected || hoveredMoodKey === mood.key
              const highlightFilter = isSelected
                ? `${hoverFiltersByMood[mood.key]} drop-shadow(0 0 1px ${mood.glowColor}) drop-shadow(0 0 6px ${mood.glowColor}) drop-shadow(0 0 12px ${mood.glowColor})`
                : hoveredMoodKey === mood.key
                  ? `${hoverFiltersByMood[mood.key]} drop-shadow(0 0 10px ${mood.glowColor})`
                  : undefined

              return (
                <div key={mood.key} className="flex flex-col items-center justify-between py-5 text-center">
                  <div className="relative flex items-center justify-center">
                    <button
                      type="button"
                      className="inline-flex h-12 w-12 cursor-pointer items-center justify-center bg-transparent p-0 transition-[filter] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
                      style={{
                        filter: isHighlighted ? highlightFilter : undefined,
                      }}
                      onMouseEnter={() => setHoveredMoodKey(mood.key)}
                      onMouseLeave={() => setHoveredMoodKey(null)}
                      onClick={() => setSelectedMood(mood.key)}
                      aria-pressed={isSelected}
                      aria-label={tm(mood?.key as string)}
                      title={tm(mood?.key as string)}
                    >
                      <mood.icon />
                    </button>
                    <div
                      className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1px] rounded-full bg-black/65 blur-[3px]"
                      style={{
                        width: ['veryBad', 'bad', 'neutral'].includes(mood.key) ? '80%' : '60%',
                        height: '2px',
                      }}
                    />
                  </div>
                  <span className="text-textcolor-tertiary mt-2 text-xs font-normal max-md:hidden">
                    {mn(mood.label)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex gap-sm max-sm:flex-col">
            <StressAssessment
              orientation={isSm ? 'vertical' : 'horizontal'}
              key={`stress-${formKey}`}
              value={stressLevel}
              onChange={(v) => setStressLevel(v)}
            />
            <EnergyAssessment
              orientation={isSm ? 'vertical' : 'horizontal'}
              key={`energy-${formKey}`}
              value={energyLevel}
              onChange={(v) => setEnergyLevel(v)}
            />
            <FocusAssessment
              orientation={isSm ? 'vertical' : 'horizontal'}
              key={`focus-${formKey}`}
              value={focusLevel}
              onChange={(v) => setFocusLevel(v)}
            />
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
    </div>
  )
}

export default AddNewMood
