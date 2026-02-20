'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { CircleCheckBig, CopyPlus, RefreshCcw, TrashIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import FullScreenCard from '@/components/shared/Cards/FullScreenCard'
import {
  createPersonalGoal,
  deletePersonalGoal,
  fetchPersonalGoals,
  PersonalGoal,
  resetPersonalGoal,
  updatePersonalGoal,
} from '@/requests/personalGoals'
import { GoalStatus, Statuses } from '@/types/goals'
import { Button } from '@/ui/button'
import { Progress } from '@/ui/progress'

export interface PersonalGoalsCardProps {
  id: string
  text: string
  check: number
  repeat: number
  status: GoalStatus
  setPersonalGoals: Dispatch<SetStateAction<PersonalGoal[]>>
}

export const PersonalGoalsCard = ({ id, text, check, repeat, status, setPersonalGoals }: PersonalGoalsCardProps) => {
  const { data: session } = useSession()
  const [dialogAction, setDialogAction] = useState<'reset' | 'delete' | null>(null)
  const t = useTranslations('components.PersonalGoals.PersonalGoalsCard')
  const tBtn = useTranslations('common.Buttons')

  const userId = session?.user?.id
  if (!userId) {
    return null
  }
  const handleClick = async () => {
    await updatePersonalGoal(session, { id, check })
    const res = await fetchPersonalGoals(session)
    setPersonalGoals(res.data ?? [])
  }

  const resetClick = async () => {
    await resetPersonalGoal(session, { id })
    const res = await fetchPersonalGoals(session)
    setPersonalGoals(res.data ?? [])
    setDialogAction(null)
  }

  const duplicateClick = async () => {
    await createPersonalGoal(session, { text, repeat })
    const res = await fetchPersonalGoals(session)
    setPersonalGoals(res.data ?? [])
  }

  const deleteClick = async () => {
    await deletePersonalGoal(session, { id })
    const res = await fetchPersonalGoals(session)
    setPersonalGoals(res.data ?? [])
    setDialogAction(null)
  }

  return (
    <>
      <Card
        className={`${status === Statuses.COMPLETED ? 'border border-white' : ''} min-h-44`}
        type={status === Statuses.COMPLETED ? 'success' : 'default'}
        text={text}
        tools={
          <>
            <Button
              variant="iconTool"
              className="h-8 w-8"
              onClick={() => duplicateClick()}
              aria-label={tBtn('duplicate')}
            >
              <CopyPlus size={16} />
            </Button>
            <Button
              variant="iconTool"
              className="h-8 w-8"
              onClick={() => setDialogAction('reset')}
              aria-label={tBtn('reset')}
            >
              <RefreshCcw size={16} />
            </Button>
            <Button
              variant="iconTool"
              className="h-8 w-8"
              onClick={() => setDialogAction('delete')}
              aria-label={tBtn('delete')}
            >
              <TrashIcon size={16} />
            </Button>
          </>
        }
      >
        <div className="flex h-full flex-col justify-end gap-sm">
          {repeat > 1 && (
            <div>
              <Progress value={(check / repeat) * 100} className="h-[6px] bg-background-alt" />
              <div className="text-textcolor-tertiary mt-2 flex justify-between text-xs/[14px] font-normal">
                <span>{t('Progress')}</span>
                <span>
                  {check}/{repeat}
                </span>
              </div>
            </div>
          )}
          {status === Statuses.COMPLETED ? (
            <div className="flex items-center justify-center gap-3 text-primary">
              <p>{t('GoalAchieved')}</p>
              <CircleCheckBig size={48} />
            </div>
          ) : (
            <Button onClick={handleClick}>{t('Mark')}</Button>
          )}
        </div>
      </Card>

      {dialogAction && (
        <FullScreenCard
          type="small"
          onClose={() => setDialogAction(null)}
          title={dialogAction === 'delete' ? t('Dialog.DeleteTitle') : t('Dialog.ResetTitle')}
        >
          <div className="">{dialogAction === 'delete' ? t('Dialog.DeleteText') : t('Dialog.ResetText')}</div>
          <div className="mt-6 grid grid-cols-2 gap-sm">
            <Button className="w-full" variant="secondary" onClick={() => setDialogAction(null)}>
              {t('Dialog.Buttons.Cancel')}
            </Button>
            <Button className="w-full" onClick={dialogAction === 'reset' ? () => resetClick() : () => deleteClick()}>
              {dialogAction === 'reset' ? t('Dialog.Buttons.Reset') : t('Dialog.Buttons.Delete')}
            </Button>
          </div>
        </FullScreenCard>
      )}
    </>
  )
}
