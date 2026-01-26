import { MinusIcon, PlusIcon } from 'lucide-react'

import CloseIconButton from '@/components/Buttons/CloseIconButton'
import FormCard from '@/components/Cards/FormCard'
import Tag from '@/components/Tag'
import { Button } from '@/ds/shadcn/button'
import { Textarea } from '@/ds/shadcn/textarea'
import { cn } from '@/lib/utils'

type CreatePersonalGoalFormProps = {
  title: string
  weOfferLabel: string
  textareaDescription: string
  quantityLabel: string
  createLabel: string
  cancelLabel: string
  suggestions: string[]
  text: string
  onTextChange: (v: string) => void
  activeSuggestion: string | null
  onSelectSuggestion: (s: string) => void
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  canDecrement: boolean
  submitDisabled: boolean
  loading?: boolean
  onSubmit: () => void
  onCancel: () => void
  showValidationEmpty: boolean
  validationEmptyMessage: string
}

export const CreatePersonalGoalForm = ({
  title,
  weOfferLabel,
  textareaDescription,
  quantityLabel,
  createLabel,
  cancelLabel,
  suggestions,
  text,
  onTextChange,
  activeSuggestion,
  onSelectSuggestion,
  quantity,
  onIncrement,
  onDecrement,
  canDecrement,
  submitDisabled,
  loading,
  onSubmit,
  onCancel,
  showValidationEmpty,
  validationEmptyMessage,
}: CreatePersonalGoalFormProps) => {
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h5 className="mb-2">{weOfferLabel}</h5>
          <div className="flex flex-wrap justify-start gap-2">
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

        <div className="flex flex-col gap-2">
          {showValidationEmpty && <h5>{validationEmptyMessage}</h5>}
          <Textarea value={text} onChange={(e) => onTextChange(e.target.value)} maxLength={60} />
          <p className="remark">{textareaDescription}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h5>{quantityLabel}</h5>
          <div className="flex items-center gap-2">
            <Button disabled={!canDecrement} onClick={onDecrement} variant="iconTool" className="h-8 w-8">
              <MinusIcon />
            </Button>
            <span>{quantity}</span>
            <Button onClick={onIncrement} variant="iconTool" className="h-8 w-8">
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
    </FormCard>
  )
}

export default CreatePersonalGoalForm
