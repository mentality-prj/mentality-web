'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { CircleCheckBig, CopyPlus, RefreshCcw, Timer, TrashIcon, TriangleAlert } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import FullScreenCard from '@/components/shared/Cards/FullScreenCard'
import type { GoalEntity } from '@/types/api-responses'
import { GoalStatus, Statuses } from '@/types/goals'
import { Button } from '@/ui/button'
import { Progress } from '@/ui/progress'

import { GOAL_ICONS, GoalIconKey } from './personalGoalSuggestions'
import { usePersonalGoalActions } from './usePersonalGoalActions'

export interface PersonalGoalsCardProps {
  id: string
  text: string
  check: number
  repeat: number
  status: GoalStatus
  deadline?: string
  iconKey?: GoalIconKey
  setPersonalGoals: Dispatch<SetStateAction<GoalEntity[]>>
}

function getRemainingDays(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export const PersonalGoalsCard = ({
  id,
  text,
  check,
  repeat,
  status,
  deadline,
  iconKey,
  setPersonalGoals,
}: PersonalGoalsCardProps) => {
  const { data: session } = useSession()
  const [dialogAction, setDialogAction] = useState<'reset' | 'delete' | null>(null)
  const t = useTranslations('components.PersonalGoals.PersonalGoalsCard')
  const tBtn = useTranslations('common.Buttons')

  const { mark, reset, duplicate, remove } = usePersonalGoalActions(setPersonalGoals)

  const userId = session?.user?.id
  if (!userId) {
    return null
  }

  const handleClick = () => mark(id, check)

  const resetClick = async () => {
    await reset(id)
    setDialogAction(null)
  }

  const duplicateClick = () => duplicate(text, repeat)

  const deleteClick = async () => {
    await remove(id)
    setDialogAction(null)
  }

  const isFailed = status === Statuses.FAILED
  const isCompleted = status === Statuses.COMPLETED
  const remainingDays = deadline && !isCompleted && !isFailed ? getRemainingDays(deadline) : null

  const IconComponent = iconKey ? GOAL_ICONS[iconKey] : null

  return (
    <>
      <Card
        className={`${isCompleted ? 'border border-white' : ''} min-h-44`}
        type={isCompleted ? 'success' : isFailed ? 'error' : 'default'}
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
        <div className="relative flex h-full flex-col justify-end gap-sm">
          {IconComponent && (
            <div className="pointer-events-none absolute -left-4 -top-14 opacity-10">
              <IconComponent size={72} />
            </div>
          )}
          {remainingDays !== null && (
            <div className="text-textcolor-tertiary flex items-center gap-xs text-xs/[14px]">
              <Timer size={14} />
              <span>{remainingDays > 0 ? t('DaysLeft', { count: remainingDays }) : t('DeadlineToday')}</span>
            </div>
          )}
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
          {isCompleted ? (
            <div className="flex items-center justify-center gap-3 text-primary">
              <p>{t('GoalAchieved')}</p>
              <CircleCheckBig size={48} />
            </div>
          ) : isFailed ? (
            <div className="flex items-center justify-center gap-3">
              <p>{t('GoalFailed')}</p>
              <TriangleAlert size={48} />
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
