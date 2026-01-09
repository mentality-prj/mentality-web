'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import FormCard from '@/components/Cards/FormCard'
import StyledTextarea from '@/components/Forms/StyledTextarea'
import Tag from '@/components/Tag/Tag'
import { Button } from '@/ds/shadcn/button'

import { MOODS } from './moods'

interface AddNewMoodProps {
  onClose: () => void
  onSave: () => void
  availableTags?: string[]
}

const AddNewMood = ({ onClose, onSave, availableTags = [] }: AddNewMoodProps) => {
  const tm = useTranslations('components.Mood')
  const ct = useTranslations('common.Buttons')

  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const mn = useTranslations('components.MoodNote')

  const addTag = (t: string) => {
    setSelectedTags((prev) => (prev.includes(t) ? prev : [...prev, t]))
  }

  const removeTag = (t: string) => {
    setSelectedTags((prev) => prev.filter((x) => x !== t))
  }

  const handleSubmit = () => {
    onSave()
    onClose()
  }

  return (
    <FormCard
      title={tm('title')}
      tools={
        <button
          type="button"
          aria-label={ct('close')}
          title={ct('close')}
          onClick={onClose}
          className="tool-icon tool-icon-text ml-4 rounded p-1"
        >
          <X className="h-5 w-5" />
        </button>
      }
      onSubmit={handleSubmit}
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
                <Tag key={t} text={t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h5>{tm('addTags')}</h5>

          <div className="mt-2 flex flex-wrap gap-2">
            {availableTags.map((t) => (
              <Tag key={t} text={t} onClick={() => addTag(t)} />
            ))}
          </div>
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
