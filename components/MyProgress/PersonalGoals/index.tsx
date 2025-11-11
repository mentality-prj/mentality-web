'use client'
import { useState } from 'react'

import { SectionCard } from '@/ds/components/SectionCard'

import { PersonalGoalsFilter } from './PersonalGoalsFilter'
import { PersonalGoalsList } from './PersonalGoalsList'
import { PersonalGoalsTitle } from './PersonalGoalsTitle'

export const PersonalGoals = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  return (
    <SectionCard className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between">
        <PersonalGoalsTitle />
        <PersonalGoalsFilter filter={filter} setFilter={setFilter} />
      </div>
      <PersonalGoalsList filter={filter} />
    </SectionCard>
  )
}
