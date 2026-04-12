'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CircleCheckBig, CopyPlus, HeartCrack, RefreshCcw, Target, Timer, TrashIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import FullScreenCard from '@/components/shared/Cards/FullScreenCard'
import type { GoalEntity } from '@/types/api-responses'
import { GoalCategory, GoalStatus, Statuses } from '@/types/goals'
import { Button } from '@/ui/button'
import { Progress } from '@/ui/progress'

import { getGoalIcon } from './personalGoalSuggestions'
import { usePersonalGoalActions } from './usePersonalGoalActions'

export interface PersonalGoalsCardProps {
  id: string
  text: string
  check: number
  repeat: number
  status: GoalStatus
  deadline?: string
  createdAt?: string
  updatedAt?: string
  category: GoalCategory
  readonly?: boolean
  setPersonalGoals: Dispatch<SetStateAction<GoalEntity[]>>
}

type TimeRemaining =
  | { unit: 'days'; count: number }
  | { unit: 'hours'; count: number }
  | { unit: 'minutes'; count: number }
  | { unit: 'now' }

function getTimeRemaining(deadline: string): TimeRemaining {
  const ms = new Date(deadline).getTime() - Date.now()
  if (ms <= 0) return { unit: 'now' }
  const hours = Math.floor(ms / (1000 * 60 * 60))
  if (hours < 1) return { unit: 'minutes', count: Math.max(1, Math.ceil(ms / (1000 * 60))) }
  if (hours < 24) return { unit: 'hours', count: hours }
  return { unit: 'days', count: Math.ceil(ms / (1000 * 60 * 60 * 24)) }
}

export const PersonalGoalsCard = ({
  id,
  text,
  check,
  repeat,
  status,
  deadline,
  createdAt,
  updatedAt,
  category,
  readonly = false,
  setPersonalGoals,
}: PersonalGoalsCardProps) => {
  const { data: session } = useSession()
  const [dialogAction, setDialogAction] = useState<'reset' | 'delete' | null>(null)
  const t = useTranslations('components.PersonalGoals.PersonalGoalsCard')
  const tBtn = useTranslations('common.Buttons')

  const { mark, reset, duplicate, remove } = usePersonalGoalActions(setPersonalGoals)

  const isFailed = status === Statuses.FAILED
  const isCompleted = status === Statuses.COMPLETED

  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(
    deadline && !isCompleted && !isFailed ? getTimeRemaining(deadline) : null
  )

  useEffect(() => {
    if (!deadline || isCompleted || isFailed) {
      setTimeLeft(null)
      return
    }
    setTimeLeft(getTimeRemaining(deadline))
    const id = setInterval(() => setTimeLeft(getTimeRemaining(deadline)), 60_000)
    return () => clearInterval(id)
  }, [deadline, isCompleted, isFailed])

  const userId = session?.user?.id
  if (!readonly && !userId) {
    return null
  }

  const handleClick = () => mark(id, check)

  const resetClick = async () => {
    await reset(id)
    setDialogAction(null)
  }

  const duplicateClick = () => {
    let newDeadline: string | undefined
    if (deadline && createdAt) {
      const duration = new Date(deadline).getTime() - new Date(createdAt).getTime()
      if (duration > 0) {
        newDeadline = new Date(Date.now() + duration).toISOString()
      }
    }
    duplicate(text, repeat, category, newDeadline)
  }

  const deleteClick = async () => {
    await remove(id)
    setDialogAction(null)
  }

  const IconComponent = category ? getGoalIcon(category) : Target

  const isMarkedToday =
    repeat > 1 &&
    check > 0 &&
    !!updatedAt &&
    new Date(updatedAt).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)

  return (
    <>
      <Card
        className={`${isCompleted ? 'border border-white' : ''} min-h-44`}
        type={isCompleted ? 'success' : isFailed ? 'error' : 'default'}
        text={text}
        tools={
          readonly ? undefined : (
            <>
              <Button
                variant="iconTool"
                className="h-8 w-8"
                onClick={() => duplicateClick()}
                aria-label={tBtn('duplicate')}
              >
                <CopyPlus size={16} />
              </Button>
              {!isFailed && (
                <Button
                  variant="iconTool"
                  className="h-8 w-8"
                  onClick={() => setDialogAction('reset')}
                  aria-label={tBtn('reset')}
                >
                  <RefreshCcw size={16} />
                </Button>
              )}
              <Button
                variant="iconTool"
                className="h-8 w-8"
                onClick={() => setDialogAction('delete')}
                aria-label={tBtn('delete')}
              >
                <TrashIcon size={16} />
              </Button>
            </>
          )
        }
      >
        <div className="relative flex h-full flex-col justify-end gap-sm">
          <div className="pointer-events-none absolute -left-4 -top-14 opacity-10">
            <IconComponent size={72} />
          </div>
          {timeLeft !== null && (
            <div className="text-textcolor-tertiary flex items-center gap-xs text-xs/[14px]">
              <Timer size={14} />
              <span>
                {timeLeft.unit === 'days'
                  ? t('DaysLeft', { count: timeLeft.count })
                  : timeLeft.unit === 'hours'
                    ? t('HoursLeft', { count: timeLeft.count })
                    : timeLeft.unit === 'minutes'
                      ? t('MinutesLeft', { count: timeLeft.count })
                      : t('DeadlineToday')}
              </span>
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
            <div className="flex items-center justify-center gap-xs text-primary">
              <p>{t('GoalAchieved')}</p>
              <CircleCheckBig size={48} />
            </div>
          ) : isFailed ? (
            <div className="flex items-center justify-center gap-xs">
              <p>{t('GoalFailed')}</p>
              <HeartCrack size={48} />
            </div>
          ) : (
            <Button onClick={handleClick} disabled={!userId || isMarkedToday}>
              {isMarkedToday ? t('MarkedToday') : t('Mark')}
            </Button>
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
