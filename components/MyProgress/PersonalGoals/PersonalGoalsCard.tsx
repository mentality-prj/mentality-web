'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import {
  deletePersonalGoal,
  fetchPersonalGoals,
  PersonalGoal,
  resetPersonalGoal,
  updatePersonalGoal,
} from '@/actions/personalGoals.action'
import { StarMotionEmoji } from '@/ds/icons/emoji/star-motion'
import { ThoughtBalloonIcon } from '@/ds/icons/emotion/thought-balloon'
import { RestartIcon } from '@/ds/icons/restart'
import { TrashIcon } from '@/ds/icons/trash'
import { Button } from '@/ds/shadcn/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ds/shadcn/dialog'
import { Progress } from '@/ds/shadcn/progress'
import { cn } from '@/lib/utils'

export interface PersonalGoalsCardProps {
  id: string
  text: string
  check: number
  repeat: number
  status: 'pending' | 'completed' | 'in progress'
  setPersonalGoals: Dispatch<SetStateAction<PersonalGoal[]>>
}

export const PersonalGoalsCard = ({ id, text, check, repeat, status, setPersonalGoals }: PersonalGoalsCardProps) => {
  const { data } = useSession()
  const [dialogAction, setDialogAction] = useState<'reset' | 'delete' | null>(null)
  const t = useTranslations('components.PersonalGoals.PersonalGoalsCard')

  const userId = data?.user?.id
  if (!userId) {
    return null
  }
  const handleClick = async () => {
    await updatePersonalGoal({ id, userId, check })
    await fetchPersonalGoals(userId).then((goals) => setPersonalGoals(goals))
  }

  const resetClick = async () => {
    await resetPersonalGoal({ id, userId })
    await fetchPersonalGoals(userId).then((goals) => setPersonalGoals(goals))
    setDialogAction(null)
  }

  const deleteClick = async () => {
    await deletePersonalGoal({ id, userId })
    await fetchPersonalGoals(userId).then((goals) => setPersonalGoals(goals))
    setDialogAction(null)
  }

  return (
    <>
      <div
        className={cn(
          'flex aspect-[11/8] flex-col justify-between gap-7 rounded-md border border-outline-secondary p-6',
          status === 'completed' && 'border-primary bg-surface-action'
        )}
      >
        <div className="flex items-start gap-2">
          <div className="">
            <ThoughtBalloonIcon />
          </div>
          <div
            className={cn(
              'mx-auto text-base font-medium text-textcolor-primary',
              status === 'completed' && 'text-primary'
            )}
          >
            {text}
          </div>
          <Button onClick={() => setDialogAction('reset')} variant="iconButton">
            <RestartIcon />
          </Button>
          <Button onClick={() => setDialogAction('delete')} variant="iconButton">
            <TrashIcon />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="">
            <Progress value={(check / repeat) * 100} className="h-[6px] bg-surface-secondary" />
            <div className="mt-2 flex justify-between text-xs/[14px] font-normal text-textcolor-tertiary">
              <div>{t('Progress')}</div>
              <div>
                {check}/{repeat}
              </div>
            </div>
          </div>
          {status === 'completed' ? (
            <div className="flex items-center justify-center gap-3 rounded-md border border-primary bg-surface-white px-3 py-4 text-xs/[14px]">
              <StarMotionEmoji />
              <p>{t('GoalAchieved')}</p>
            </div>
          ) : (
            <Button onClick={handleClick}>{t('Mark')}</Button>
          )}
        </div>
      </div>

      <Dialog open={!!dialogAction} onOpenChange={() => setDialogAction(null)}>
        <DialogContent className="max-w-fit">
          <DialogHeader>
            <DialogTitle>{dialogAction === 'delete' ? t('Dialog.DeleteTitle') : t('Dialog.ResetTitle')}</DialogTitle>
          </DialogHeader>
          <div className="">{dialogAction === 'delete' ? t('Dialog.DeleteText') : t('Dialog.ResetText')}</div>
          <DialogFooter className="flex w-full gap-4">
            <DialogClose asChild>
              <Button className="w-full" variant="secondary">
                {t('Dialog.Buttons.Cancel')}
              </Button>
            </DialogClose>
            {/* TODO: replace the button with variant="destructive" */}
            <Button onClick={dialogAction === 'reset' ? () => resetClick() : () => deleteClick()} className="w-full">
              {dialogAction === 'reset' ? t('Dialog.Buttons.Reset') : t('Dialog.Buttons.Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
