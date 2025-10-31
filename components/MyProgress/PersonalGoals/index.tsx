'use client'
import { SectionCard } from '@/components/ui/SectionCard'

import { PersonalGoalsTitle } from './PersonalGoalsTitle'
import { PersonalGoalsFilter } from './PersonalGoalsFilter'
import { PersonalGoalsList } from './PersonalGoalsList'
import { useState } from 'react'

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
