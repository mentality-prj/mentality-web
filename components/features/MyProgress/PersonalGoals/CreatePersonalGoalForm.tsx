import { MinusIcon, PlusIcon } from 'lucide-react'

import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import { Tag } from '@/ds/components/Tag'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'

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
            </div>
          </div>
        )}

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
                    onCustomDeadlineChange(v === '' ? '' : Math.max(1, parseInt(v, 10)))
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
