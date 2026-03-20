'use client'
import { useState } from 'react'

import { Filter, PersonalGoalsFilter } from './PersonalGoalsFilter'
import { PersonalGoalsList } from './PersonalGoalsList'
import { PersonalGoalsTitle } from './PersonalGoalsTitle'

export const PersonalGoals = () => {
  const [filter, setFilter] = useState<Filter>('all')
  return (
    <section className="flex w-full flex-col items-center gap-default">
      <div className="flex w-full flex-col gap-sm desktop:flex-row desktop:items-center desktop:justify-between">
        <PersonalGoalsTitle />
        <PersonalGoalsFilter filter={filter} setFilter={setFilter} />
      </div>
      <PersonalGoalsList filter={filter} />
    </section>
  )
}
