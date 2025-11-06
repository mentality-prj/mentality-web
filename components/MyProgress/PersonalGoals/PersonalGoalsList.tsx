'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { fetchPersonalGoals, PersonalGoal } from '@/actions/personalGoals.action'

import { CreatePersonalGoals } from './CreatePersonalGoals'
import { PersonalGoalsCard } from './PersonalGoalsCard'
import { Filter } from './PersonalGoalsFilter'

export const PersonalGoalsList = ({ filter }: { filter: Filter }) => {
  const { data: session } = useSession()

  const userId = session?.user?.id

  const [personalGoals, setPersonalGoals] = useState<PersonalGoal[]>([])

  useEffect(() => {
    if (!userId) {
      return
    }
    const fetchGoals = async () => {
      const personalGoalsData = await fetchPersonalGoals(userId)
      setPersonalGoals(personalGoalsData)
    }
    fetchGoals()
  }, [userId])

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
      <CreatePersonalGoals setPersonalGoals={setPersonalGoals} />
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
              .filter((goal) => goal.status === 'pending' || goal.status === 'in progress')
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
                .filter((goal) => goal.status === 'completed')
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
