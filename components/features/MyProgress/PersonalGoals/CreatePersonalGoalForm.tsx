import { MinusIcon, PlusIcon } from 'lucide-react'

import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import { Tag } from '@/ds/components/Tag'
import { cn } from '@/lib/utils'
import { GoalCategory } from '@/types/goals'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'

import { GOAL_CATEGORIES, GOAL_ICONS } from './personalGoalSuggestions'

export const DEADLINE_UNITS = ['hour', 'day'] as const
export type DeadlineUnit = (typeof DEADLINE_UNITS)[number]

export const GOAL_TYPES = ['onetime', 'shortterm', 'longterm', 'repeating'] as const
export type GoalType = (typeof GOAL_TYPES)[number]

type CreatePersonalGoalFormProps = {
  title: string
  goalTypeLabel: string
  goalTypeOptions: Array<{ type: GoalType; label: string }>
  selectedGoalType: GoalType
  onSelectGoalType: (t: GoalType) => void
  weOfferLabel: string
  textareaDescription: string
  suggestions: string[]
  text: string
  activeSuggestion: string | null
  onTextChange: (v: string) => void
  onSelectSuggestion: (s: string) => void
  // repeating only
  quantityLabel: string
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  canDecrement: boolean
  deadlineLabel: string
  deadlineCustomValue: number | ''
  deadlineCustomUnit: DeadlineUnit
  deadlineUnitOptions: Array<{ unit: DeadlineUnit; label: string }>
  onCustomDeadlineChange: (v: number | '') => void
  onCustomDeadlineUnitChange: (u: DeadlineUnit) => void
  deadlineLocked?: boolean
  // form
  createLabel: string
  cancelLabel: string
  submitDisabled: boolean
  loading?: boolean
  onSubmit: () => void
  onCancel: () => void
  showValidationEmpty: boolean
  validationEmptyMessage: string
  // show more suggestions
  hasMoreSuggestions: boolean
  showMoreLabel: string
  onShowMoreSuggestions: () => void
  // icon picker
  category: GoalCategory | null
  onSelectCategory: (key: GoalCategory) => void
  iconPickerLabel: string
  iconLabels: Record<Exclude<GoalCategory, 'default'>, string>
}

export const CreatePersonalGoalForm = ({
  title,
  goalTypeLabel,
  goalTypeOptions,
  selectedGoalType,
  onSelectGoalType,
  weOfferLabel,
  textareaDescription,
  suggestions,
  text,
  activeSuggestion,
  onTextChange,
  onSelectSuggestion,
  quantityLabel,
  quantity,
  onIncrement,
  onDecrement,
  canDecrement,
  deadlineLabel,
  deadlineCustomValue,
  deadlineCustomUnit,
  deadlineUnitOptions,
  onCustomDeadlineChange,
  onCustomDeadlineUnitChange,
  deadlineLocked = false,
  createLabel,
  cancelLabel,
  submitDisabled,
  loading,
  onSubmit,
  onCancel,
  showValidationEmpty,
  validationEmptyMessage,
  hasMoreSuggestions,
  showMoreLabel,
  onShowMoreSuggestions,
  category,
  onSelectCategory,
  iconPickerLabel,
  iconLabels,
}: CreatePersonalGoalFormProps) => {
  const hasRepeatControls =
    selectedGoalType === 'repeating' ||
    selectedGoalType === 'shortterm' ||
    selectedGoalType === 'longterm' ||
    deadlineLocked

  return (
    <FormCard
      title={title}
      onSubmit={onSubmit}
      submitDisabled={submitDisabled || !!loading}
      submitLabel={createLabel}
      onCancel={onCancel}
      cancelLabel={cancelLabel}
      tools={<CloseIconButton onClick={onCancel} />}
    >
      <div className="flex flex-col gap-default">
        {/* Goal type selector */}
        <div className="flex flex-col gap-xs">
          <h5>{goalTypeLabel}</h5>
          <div className="flex flex-wrap gap-xs">
            {goalTypeOptions.map(({ type, label }) => (
              <Tag
                key={type}
                text={label}
                onClick={() => onSelectGoalType(type)}
                className={cn(selectedGoalType === type ? 'text-reversed bg-info' : '')}
              />
            ))}
          </div>
        </div>

        {/* Suggestions for current type */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-xs">
            <h5 className="mb-2">{weOfferLabel}</h5>
            <div className="flex flex-wrap justify-start gap-xs">
              {suggestions.map((suggestion) => (
                <Tag
                  key={suggestion}
                  text={suggestion}
                  onClick={() => onSelectSuggestion(suggestion)}
                  className={cn(activeSuggestion === suggestion ? 'text-reversed bg-info' : '')}
                />
              ))}
              {hasMoreSuggestions && <Tag type="info" text={showMoreLabel} onClick={onShowMoreSuggestions} />}
            </div>
          </div>
        )}

        {/* Icon picker */}
        <div className="flex flex-col gap-xs">
          <h5>{iconPickerLabel}</h5>
          <TooltipProvider>
            <div className="grid grid-cols-12 gap-xs">
              {GOAL_CATEGORIES.filter((key) => key !== 'default').map((key) => {
                const Icon = GOAL_ICONS[key as Exclude<GoalCategory, 'default'>]
                const isSelected = category === key
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onSelectCategory(key as GoalCategory)}
                        className={cn(
                          'icon-tool icon-tool-text flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                          isSelected ? '!bg-background-muted !text-primary' : ''
                        )}
                        aria-label={iconLabels[key as Exclude<GoalCategory, 'default'>]}
                        aria-pressed={isSelected}
                      >
                        <Icon size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{iconLabels[key as Exclude<GoalCategory, 'default'>]}</TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </TooltipProvider>
        </div>

        {/* Text input */}
        <div className="flex flex-col gap-xs">
          {showValidationEmpty && <h5>{validationEmptyMessage}</h5>}
          <Textarea value={text} onChange={(e) => onTextChange(e.target.value)} maxLength={60} />
          <p className="remark">{textareaDescription}</p>
        </div>

        {/* Short-term and repeating: quantity + deadline */}
        {hasRepeatControls && (
          <>
            <div className="flex flex-col gap-xs">
              <h5>{quantityLabel}</h5>
              <div className="flex items-center gap-xs">
                <Button
                  disabled={!canDecrement || deadlineLocked}
                  onClick={onDecrement}
                  variant="iconTool"
                  className="h-8 w-8"
                >
                  <MinusIcon />
                </Button>
                <span>{quantity}</span>
                <Button disabled={deadlineLocked} onClick={onIncrement} variant="iconTool" className="h-8 w-8">
                  <PlusIcon />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <h5>{deadlineLabel}</h5>
              <div className="flex items-center gap-xs">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={deadlineCustomValue}
                  onChange={(e) => {
                    const v = e.target.value
                    const parsed = parseInt(v, 10)
                    onCustomDeadlineChange(v === '' ? '' : Number.isNaN(parsed) ? 1 : Math.max(1, parsed))
                  }}
                  className="w-20"
                  placeholder="—"
                  disabled={deadlineLocked}
                />
                <div className="flex gap-xs">
                  {deadlineUnitOptions.map(({ unit, label }) => (
                    <Tag
                      key={unit}
                      text={label}
                      onClick={() => !deadlineLocked && onCustomDeadlineUnitChange(unit)}
                      className={cn(
                        deadlineCustomUnit === unit && deadlineCustomValue !== '' ? 'text-reversed bg-info' : '',
                        deadlineLocked ? 'cursor-default opacity-60' : ''
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </FormCard>
  )
}

export default CreatePersonalGoalForm
