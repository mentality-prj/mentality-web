'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { useAuth } from '@/context/AuthProvider'
import { Tag } from '@/ds/components/Tag'
import { cn } from '@/lib/utils'
import type { GoalEntity } from '@/types/api-responses'
import { GoalCategories, GoalCategory } from '@/types/goals'

import CreatePersonalGoalButton from './CreatePersonalGoalButton'
import CreatePersonalGoalForm, { DEADLINE_UNITS, DeadlineUnit, GOAL_TYPES, GoalType } from './CreatePersonalGoalForm'
import { getPersonalGoalSuggestions, GOAL_CATEGORIES, GOAL_ICONS } from './personalGoalSuggestions'
import useCreatePersonalGoal from './useCreatePersonalGoal'

export const CreatePersonalGoals = ({ onCreated }: { onCreated?: (goal?: GoalEntity) => void }) => {
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const [goalType, setGoalType] = useState<GoalType>('onetime')
  const [customDeadlineValue, setCustomDeadlineValue] = useState<number | ''>('')
  const [customDeadlineUnit, setCustomDeadlineUnit] = useState<DeadlineUnit>('day')
  const [deadlineLocked, setDeadlineLocked] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(null)
  const [showAllPopup, setShowAllPopup] = useState(false)
  const { session } = useAuth()
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
  const filteredSuggestions = selectedCategory
    ? currentSuggestions.filter((s) => s.category === selectedCategory)
    : currentSuggestions

  const VISIBLE_COUNT = 7
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const visibleSuggestionLabels = useMemo(() => {
    const shuffled = [...filteredSuggestions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, VISIBLE_COUNT).map((s) => s.label)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalType, selectedCategory])

  const hasMoreSuggestions = filteredSuggestions.length > VISIBLE_COUNT

  const deadlineUnitOptions = DEADLINE_UNITS.map((unit) => ({
    unit,
    label: t(`Deadline.Units.${unit}`),
  }))

  const iconLabels: Record<Exclude<GoalCategory, 'default'>, string> = {
    sport: t('IconPicker.Categories.sport'),
    walk: t('IconPicker.Categories.walk'),
    food: t('IconPicker.Categories.food'),
    social: t('IconPicker.Categories.social'),
    reading: t('IconPicker.Categories.reading'),
    learning: t('IconPicker.Categories.learning'),
    journaling: t('IconPicker.Categories.journaling'),
    meditation: t('IconPicker.Categories.meditation'),
    health: t('IconPicker.Categories.health'),
    sleep: t('IconPicker.Categories.sleep'),
    art: t('IconPicker.Categories.art'),
    noPhone: t('IconPicker.Categories.noPhone'),
  }
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null)
  const { create, loading } = useCreatePersonalGoal()

  if (!session?.user?.id) {
    return null
  }

  const handleSelectSuggestion = (label: string) => {
    setText(label)
    setActiveSuggestion(label)
    const item = currentSuggestions.find((i) => i.label === label)
    if (item) setSelectedCategory(item.category)
    const preset = item?.preset
    if (preset) {
      setCustomDeadlineValue(preset.value)
      setCustomDeadlineUnit(preset.unit)
      setQuantity(preset.repeat)
      setDeadlineLocked(true)
    } else {
      setDeadlineLocked(false)
    }
  }

  const createPersonalGoalClick = async () => {
    let deadline: string | undefined
    if (customDeadlineValue !== '') {
      const msPerUnit = customDeadlineUnit === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
      deadline = new Date(Date.now() + customDeadlineValue * msPerUnit).toISOString()
    }
    const repeat =
      goalType === 'repeating' || goalType === 'shortterm' || goalType === 'longterm' || deadlineLocked ? quantity : 1
    const res = await create(text, repeat, selectedCategory || GoalCategories.DEFAULT, deadline)
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
    setSelectedCategory(null)
    setShowAllPopup(false)
    setOpen(false)
  }

  return (
    <>
      {!open ? (
        <CreatePersonalGoalButton text={t('Text')} onClick={() => setOpen(true)} />
      ) : (
        <>
          <FullScreenBackdrop onClick={closeForm} />
          <div className="fixed inset-0 z-50 overflow-y-scroll p-4">
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
                  setSelectedCategory(null)
                }}
                weOfferLabel={t('WeOffer')}
                textareaDescription={t('TextareaDescription')}
                suggestions={visibleSuggestionLabels}
                text={text}
                activeSuggestion={activeSuggestion}
                onTextChange={(v) => {
                  setText(v)
                  if (deadlineLocked && v !== activeSuggestion) {
                    setDeadlineLocked(false)
                  }
                }}
                onSelectSuggestion={handleSelectSuggestion}
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
                hasMoreSuggestions={hasMoreSuggestions}
                showMoreLabel={t('ShowMore')}
                onShowMoreSuggestions={() => setShowAllPopup(true)}
                category={selectedCategory}
                onSelectCategory={setSelectedCategory}
                iconPickerLabel={t('IconPicker.Label')}
                iconLabels={iconLabels}
              />
            </div>
          </div>
        </>
      )}
      {showAllPopup && (
        <>
          <FullScreenBackdrop onClick={() => setShowAllPopup(false)} className="!z-[60]" />
          <div className="fixed inset-0 z-[61] overflow-y-scroll p-4">
            <div className="mx-auto w-full max-w-[680px] rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h4>{t('AllSuggestions.Title')}</h4>
                <CloseIconButton onClick={() => setShowAllPopup(false)} />
              </div>
              <div className="flex flex-col divide-y divide-border">
                {GOAL_CATEGORIES.map((cat) => {
                  if (cat === 'default') return null
                  const items = currentSuggestions.filter((s) => s.category === cat)
                  if (items.length === 0) return null
                  const Icon = GOAL_ICONS[cat as GoalCategory]
                  const categoryLabel = iconLabels[cat as Exclude<GoalCategory, 'default'>]
                  return (
                    <div key={cat} className="py-6 first:pt-0 last:pb-0">
                      <div className="mb-2 flex items-center gap-1.5 text-textcolor-secondary">
                        <Icon size={13} />
                        <span className="text-xs font-medium uppercase tracking-wide">{categoryLabel}</span>
                      </div>
                      <div className="flex flex-wrap gap-xs">
                        {items.map((s) => (
                          <Tag
                            key={s.label}
                            text={s.label}
                            onClick={() => {
                              handleSelectSuggestion(s.label)
                              setShowAllPopup(false)
                            }}
                            className={cn(activeSuggestion === s.label ? 'text-reversed bg-info' : '')}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
