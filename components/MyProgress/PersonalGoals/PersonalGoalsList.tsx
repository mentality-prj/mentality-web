'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { fetchPersonalGoals, PersonalGoal } from '@/requests/personalGoals'
import { Statuses } from '@/types/goals'

import { CreatePersonalGoals } from './CreatePersonalGoals'
import { PersonalGoalsCard } from './PersonalGoalsCard'
import { Filter } from './PersonalGoalsFilter'

export const PersonalGoalsList = ({ filter, refreshKey = 0 }: { filter: Filter; refreshKey?: number }) => {
  const { data: session } = useSession()
  const [personalGoals, setPersonalGoals] = useState<PersonalGoal[]>([])

  const handleCreated = (newGoal?: PersonalGoal) => {
    if (!newGoal) {
      // if no goal provided, fallback to refetch
      const refetch = async () => {
        const res = await fetchPersonalGoals(session)
        if ('error' in res) return
        setPersonalGoals(res.data ?? [])
      }
      void refetch()
      return
    }

    setPersonalGoals((prev) => [newGoal, ...prev])
  }

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetchPersonalGoals(session)
      if ('error' in res) return
      setPersonalGoals(res.data ?? [])
    }
    fetchGoals()
  }, [session, refreshKey])

  return (
    <div className="grid w-full grid-cols-1 items-stretch gap-default laptop:grid-cols-2 desktop:grid-cols-3">
      {/* First card: create new goal */}
      <CreatePersonalGoals onCreated={handleCreated} />

      {filter === 'all'
        ? personalGoals.map((goal) => (
            <PersonalGoalsCard
              key={goal.id}
              id={goal.id}
              text={goal.text}
              repeat={goal.repeat}
              check={goal.check}
              status={goal.status}
              setPersonalGoals={setPersonalGoals}
            />
          ))
        : filter === 'pending'
          ? personalGoals
              .filter((goal) => goal.status === Statuses.PENDING || goal.status === Statuses.IN_PROGRESS)
              .map((goal) => (
                <PersonalGoalsCard
                  key={goal.id}
                  id={goal.id}
                  text={goal.text}
                  repeat={goal.repeat}
                  check={goal.check}
                  status={goal.status}
                  setPersonalGoals={setPersonalGoals}
                />
              ))
          : filter === 'completed'
            ? personalGoals
                .filter((goal) => goal.status === Statuses.COMPLETED)
                .map((goal) => (
                  <PersonalGoalsCard
                    key={goal.id}
                    id={goal.id}
                    text={goal.text}
                    repeat={goal.repeat}
                    check={goal.check}
                    status={goal.status}
                    setPersonalGoals={setPersonalGoals}
                  />
                ))
            : null}
    </div>
  )
}
