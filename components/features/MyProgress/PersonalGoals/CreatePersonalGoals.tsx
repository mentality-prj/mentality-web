'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import type { PersonalGoal } from '@/requests/personalGoals'

import CreatePersonalGoalButton from './CreatePersonalGoalButton'
import CreatePersonalGoalForm from './CreatePersonalGoalForm'
import useCreatePersonalGoal from './useCreatePersonalGoal'

export const CreatePersonalGoals = ({ onCreated }: { onCreated?: (goal?: PersonalGoal) => void }) => {
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const t = useTranslations('components.PersonalGoals.CreatePersonalGoals')
  const defaultTextSuggestions = [
    t('DefaultTextSuggestions.SleepBetter'),
    t('DefaultTextSuggestions.DayWithoutMedia'),
    t('DefaultTextSuggestions.CoffeeLimit'),
  ]
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null)
  const { create, loading } = useCreatePersonalGoal()

  if (!session?.user?.id) {
    return null
  }

  const createPersonalGoalClick = async () => {
    const res = await create(text, quantity)
    if (res?.data) {
      closeForm()
      onCreated?.(res.data)
    }
  }

  const closeForm = () => {
    setText('')
    setQuantity(1)
    setActiveSuggestion(null)
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
                weOfferLabel={t('WeOffer')}
                textareaDescription={t('TextareaDescription')}
                quantityLabel={t('QuantityOfRepeat')}
                createLabel={t('Buttons.Create')}
                cancelLabel={t('Buttons.Cancel')}
                suggestions={defaultTextSuggestions}
                text={text}
                onTextChange={setText}
                activeSuggestion={activeSuggestion}
                onSelectSuggestion={(s) => {
                  setText(s)
                  setActiveSuggestion(s)
                }}
                quantity={quantity}
                onIncrement={() => setQuantity(quantity + 1)}
                onDecrement={() => setQuantity(quantity - 1)}
                canDecrement={quantity > 1}
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
