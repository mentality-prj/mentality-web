'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import FormCard from '@/components/Cards/FormCard'
import StyledTextarea from '@/components/Forms/StyledTextarea'
import Tag from '@/components/Tag/Tag'

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

  const addTag = (t: string) => {
    setSelectedTags((prev) => (prev.includes(t) ? prev : [...prev, t]))
  }

  const removeTag = (t: string) => {
    setSelectedTags((prev) => prev.filter((x) => x !== t))
  }

  const handleSubmit = () => {
    // keep onSave signature unchanged (called by parent)
    // parent can close the form; we still maintain local state
    // TODO: persist `selectedMood` and `note` to API when available
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
          className="ml-4 rounded p-1 text-gray-500 hover:bg-gray-100"
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
        <div className="flex items-center justify-between px-2">
          {MOODS.map((m) => {
            const Icon = m.icon
            const isSelected = selectedMood === m.key
            return (
              <div key={m.key} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMood(m.key)}
                  aria-pressed={isSelected}
                  aria-label={tm(m.key)}
                  title={tm(m.key)}
                  className={`focus:outline-none ${isSelected ? `${m.statusClass} ring-2 ring-violet-300` : 'bg-violet-50'} rounded-full p-3`}
                >
                  {isSelected ? <Icon className="h-6 w-6" /> : <Icon className="h-6 w-6 text-violet-600" />}
                </button>
                <div className="text-xs text-gray-500">{tm(m.key)}</div>
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
