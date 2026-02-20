'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import type { GoalEntity } from '@/types/api-responses'

import CreatePersonalGoalButton from './CreatePersonalGoalButton'
import CreatePersonalGoalForm, { DEADLINE_UNITS, DeadlineUnit, GOAL_TYPES, GoalType } from './CreatePersonalGoalForm'
import { getPersonalGoalSuggestions } from './personalGoalSuggestions'
import useCreatePersonalGoal from './useCreatePersonalGoal'

export const CreatePersonalGoals = ({ onCreated }: { onCreated?: (goal?: GoalEntity) => void }) => {
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const [goalType, setGoalType] = useState<GoalType>('onetime')
  const [customDeadlineValue, setCustomDeadlineValue] = useState<number | ''>('')
  const [customDeadlineUnit, setCustomDeadlineUnit] = useState<DeadlineUnit>('day')
  const [deadlineLocked, setDeadlineLocked] = useState(false)
  const { data: session } = useSession()
  const t = useTranslations('components.PersonalGoals.CreatePersonalGoals')

  const goalTypeOptions = GOAL_TYPES.map((type) => ({
    type,
    label: t(`GoalTypes.${type}`),
  }))

  const suggestionsByType = getPersonalGoalSuggestions(t)

  const currentSuggestions =
    goalType === 'onetime'
      ? suggestionsByType.onetime
      : goalType === 'shortterm'
        ? suggestionsByType.shortterm
        : goalType === 'longterm'
          ? suggestionsByType.longterm
          : suggestionsByType.repeating
  const suggestionLabels = currentSuggestions.map((s) => s.label)

  const deadlineUnitOptions = DEADLINE_UNITS.map((unit) => ({
    unit,
    label: t(`Deadline.Units.${unit}`),
  }))
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null)
  const { create, loading } = useCreatePersonalGoal()

  if (!session?.user?.id) {
    return null
  }

  const createPersonalGoalClick = async () => {
    let deadline: string | undefined
    if (customDeadlineValue !== '') {
      const msPerUnit = customDeadlineUnit === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
      deadline = new Date(Date.now() + customDeadlineValue * msPerUnit).toISOString()
    }
    const repeat =
      goalType === 'repeating' || goalType === 'shortterm' || goalType === 'longterm' || deadlineLocked ? quantity : 1
    const res = await create(text, repeat, deadline)
    if (res?.data) {
      closeForm()
      onCreated?.(res.data)
    }
  }

  const closeForm = () => {
    setText('')
    setQuantity(1)
    setActiveSuggestion(null)
    setGoalType('onetime')
    setCustomDeadlineValue('')
    setCustomDeadlineUnit('day')
    setDeadlineLocked(false)
    setOpen(false)
  }

  return (
    <>
      {!open ? (
        <CreatePersonalGoalButton text={t('Text')} onClick={() => setOpen(true)} />
      ) : (
        <>
          <FullScreenBackdrop onClick={closeForm} />
          <div className="fixed inset-0 z-50 overflow-y-auto p-4">
            <div className="mx-auto w-full max-w-[680px]">
              <CreatePersonalGoalForm
                title={t('Title')}
                goalTypeLabel={t('GoalTypeLabel')}
                goalTypeOptions={goalTypeOptions}
                selectedGoalType={goalType}
                onSelectGoalType={(type) => {
                  setGoalType(type)
                  setText('')
                  setActiveSuggestion(null)
                  setQuantity(1)
                  setCustomDeadlineValue('')
                  setDeadlineLocked(false)
                }}
                weOfferLabel={t('WeOffer')}
                textareaDescription={t('TextareaDescription')}
                suggestions={suggestionLabels}
                text={text}
                activeSuggestion={activeSuggestion}
                onTextChange={(v) => {
                  setText(v)
                  if (deadlineLocked && v !== activeSuggestion) {
                    setDeadlineLocked(false)
                  }
                }}
                onSelectSuggestion={(s) => {
                  setText(s)
                  setActiveSuggestion(s)
                  const preset = currentSuggestions.find((item) => item.label === s)?.preset
                  if (preset) {
                    setCustomDeadlineValue(preset.value)
                    setCustomDeadlineUnit(preset.unit)
                    setQuantity(preset.repeat)
                    setDeadlineLocked(true)
                  } else {
                    setDeadlineLocked(false)
                  }
                }}
                quantityLabel={t('QuantityOfRepeat')}
                quantity={quantity}
                onIncrement={() => setQuantity(quantity + 1)}
                onDecrement={() => setQuantity(quantity - 1)}
                canDecrement={quantity > 1}
                deadlineLabel={t('Deadline.Label')}
                deadlineCustomValue={customDeadlineValue}
                deadlineCustomUnit={customDeadlineUnit}
                deadlineUnitOptions={deadlineUnitOptions}
                onCustomDeadlineChange={setCustomDeadlineValue}
                onCustomDeadlineUnitChange={(unit) => {
                  setCustomDeadlineUnit(unit)
                  setCustomDeadlineValue((prev) => (prev === '' ? 1 : prev))
                }}
                deadlineLocked={deadlineLocked}
                createLabel={t('Buttons.Create')}
                cancelLabel={t('Buttons.Cancel')}
                submitDisabled={text.trim().length === 0}
                loading={loading}
                onSubmit={createPersonalGoalClick}
                onCancel={closeForm}
                showValidationEmpty={text.trim().length === 0}
                validationEmptyMessage={t('Validation.Empty')}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
