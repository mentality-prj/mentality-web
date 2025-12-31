'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { createPersonalGoal, fetchPersonalGoals, PersonalGoal } from '@/actions/personalGoals.action'
import { Tag } from '@/ds/components/Tag'
import { AddIcon } from '@/ds/icons/add'
import { AddSquareIcon } from '@/ds/icons/add-square'
import { MinusSquareIcon } from '@/ds/icons/minus-square'
import { Button } from '@/ds/shadcn/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/ds/shadcn/dialog'
import { Textarea } from '@/ds/shadcn/textarea'
import { ToggleGroup } from '@/ds/shadcn/toggle-group'

export const CreatePersonalGoals = ({
  setPersonalGoals,
}: {
  setPersonalGoals: Dispatch<SetStateAction<PersonalGoal[]>>
}) => {
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const { data } = useSession()
  const t = useTranslations('components.PersonalGoals.CreatePersonalGoals')
  const defaultTextSuggestions = [
    t('DefaultTextSuggestions.SleepBetter'),
    t('DefaultTextSuggestions.DayWithoutMedia'),
    t('DefaultTextSuggestions.CoffeeLimit'),
  ]

  if (!data?.user?.id) {
    return null
  }
  const userId = data.user.id

  const createPersonalGoalClick = async () => {
    await createPersonalGoal({ userId, text, repeat: quantity })
    closeDialog()
    await fetchPersonalGoals(userId).then((goals) => setPersonalGoals(goals))
  }

  const closeDialog = () => {
    setText('')
    setQuantity(1)
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border-outline-secondary group flex aspect-[11/8] flex-col items-center justify-center gap-[14px] rounded-md border p-2 px-9 py-20 hover:cursor-pointer hover:border-2 hover:border-primary-hover">
        <div className="text-primary group-hover:text-primary-hover">
          <AddIcon />
        </div>
        <span className="bg-secondary-hover group-hover:bg-secondary-pressed whitespace-nowrap rounded-sm px-3 py-2 font-semibold text-primary group-hover:text-primary-hover">
          {t('Text')}
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-[680px]">
        <DialogTitle>{t('Title')}</DialogTitle>
        <DialogDescription>
          <div>
            <div className="mb-2">{t('WeOffer')}</div>
            <div>
              <ToggleGroup
                onValueChange={(value) => setText(value)}
                className="flex flex-wrap justify-start gap-2"
                type="single"
              >
                {defaultTextSuggestions.map((suggestion) => (
                  <Tag key={suggestion} text={suggestion} value={suggestion} />
                ))}
              </ToggleGroup>
            </div>
            <div className="my-5">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={60} />
              <p className="text-textcolor-tertiary text-xs font-normal">{t('TextareaDescription')}</p>
            </div>
            <div className="">
              <div className="">{t('QuantityOfRepeat')}</div>
              <div className="mt-2 flex items-center gap-2">
                <Button disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)} variant="iconButton">
                  <MinusSquareIcon />
                </Button>
                <span>{quantity}</span>
                <Button onClick={() => setQuantity(quantity + 1)} variant="iconButton">
                  <AddSquareIcon />
                </Button>
              </div>
              <div className="mt-5 flex gap-4">
                <DialogClose asChild>
                  <Button onClick={closeDialog} variant="secondary" className="w-full">
                    {t('Buttons.Cancel')}
                  </Button>
                </DialogClose>
                <Button onClick={createPersonalGoalClick} variant="default" className="w-full">
                  {t('Buttons.Create')}
                </Button>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
