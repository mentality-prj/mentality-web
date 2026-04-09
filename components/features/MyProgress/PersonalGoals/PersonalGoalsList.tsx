'use client'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { GoalEntity } from '@/types/api-responses'
import { Statuses } from '@/types/goals'

import { CreatePersonalGoals } from './CreatePersonalGoals'
import { PersonalGoalsCard } from './PersonalGoalsCard'
import { Filter } from './PersonalGoalsFilter'
import { buildGoalIconLookup } from './personalGoalSuggestions'

function sortByDeadline(goals: GoalEntity[]): GoalEntity[] {
  return [...goals].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })
}

export const PersonalGoalsList = ({
  filter,
  refreshKey = 0,
  showCreate = true,
  limit,
  viewAllHref,
  readonly = false,
  initialGoals,
  className,
}: {
  filter: Filter
  refreshKey?: number
  showCreate?: boolean
  limit?: number
  viewAllHref?: string
  readonly?: boolean
  initialGoals?: GoalEntity[]
  className?: string
}) => {
  const { data: session } = useSession()
  const [personalGoals, setPersonalGoals] = useState<GoalEntity[]>(initialGoals ?? [])
  const [isLoading, setIsLoading] = useState(!initialGoals)
  const [error, setError] = useState(false)
  const t = useTranslations('components.PersonalGoals.CreatePersonalGoals')
  const tList = useTranslations('components.PersonalGoals.PersonalGoalsList')
  const iconLookup = useMemo(() => buildGoalIconLookup(t), [t])

  const handleCreated = (newGoal?: GoalEntity) => {
    if (!newGoal) {
      // if no goal provided, fallback to refetch
      const refetch = async () => {
        const res = await fetchPersonalGoals(session)
        if ('error' in res) {
          logger.error('Failed to refetch personal goals.', { error: res.error })
          return
        }
        setPersonalGoals(res.data ?? [])
      }
      void refetch()
      return
    }

    setPersonalGoals((prev) => [newGoal, ...prev])
  }

  useEffect(() => {
    if (initialGoals) return
    const fetchGoals = async () => {
      const res = await fetchPersonalGoals(session)
      if ('error' in res) {
        logger.error('Failed to fetch personal goals.', { error: res.error })
        setError(true)
        setIsLoading(false)
        return
      }
      setPersonalGoals(res.data ?? [])
      setIsLoading(false)
    }
    fetchGoals()
  }, [session, refreshKey, initialGoals])

  const filteredGoals = (() => {
    if (filter === 'all') {
      const pending = sortByDeadline(
        personalGoals.filter((g) => g.status === Statuses.PENDING || g.status === Statuses.IN_PROGRESS)
      )
      const completed = sortByDeadline(
        personalGoals.filter((g) => g.status === Statuses.COMPLETED || g.status === Statuses.FAILED)
      )
      return [...pending, ...completed]
    }
    if (filter === 'pending')
      return sortByDeadline(
        personalGoals.filter((g) => g.status === Statuses.PENDING || g.status === Statuses.IN_PROGRESS)
      )
    if (filter === 'completed') return sortByDeadline(personalGoals.filter((g) => g.status === Statuses.COMPLETED))
    if (filter === 'failed') return sortByDeadline(personalGoals.filter((g) => g.status === Statuses.FAILED))
    return []
  })()

  const hasMore = limit !== undefined && filteredGoals.length > limit
  const visibleGoals = hasMore ? filteredGoals.slice(0, limit) : filteredGoals

  return (
    <div
      className={cn(
        showCreate
          ? 'grid w-full grid-cols-1 items-stretch gap-default desktop:grid-cols-2'
          : 'flex w-full flex-col gap-sm',
        className
      )}
    >
      {showCreate && <CreatePersonalGoals onCreated={handleCreated} />}
      {!showCreate && !isLoading && !error && visibleGoals.length === 0 && (
        <div className="flex flex-col gap-xs text-textcolor-muted">
          <h3>{tList('EmptyTitle')}</h3>
          <p className="text-sm">{tList('EmptyText')}</p>
          <CreatePersonalGoals onCreated={handleCreated} />
        </div>
      )}
      {visibleGoals.map((goal) => (
        <PersonalGoalsCard
          key={goal.id}
          id={goal.id}
          text={goal.text}
          repeat={goal.repeat}
          check={goal.check}
          status={goal.status}
          deadline={goal.deadline}
          createdAt={goal.createdAt}
          updatedAt={goal.updatedAt}
          category={goal.category ?? iconLookup[goal.text]}
          readonly={readonly}
          setPersonalGoals={setPersonalGoals}
        />
      ))}
      {hasMore && viewAllHref && (
        <Link href={viewAllHref} className="text-sm text-primary underline">
          {tList('ViewAll')}
        </Link>
      )}
    </div>
  )
}
