import { Dispatch, SetStateAction } from 'react'
import { useTranslations } from 'next-intl'

import { Statuses } from '@/types/goals'
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs'

export type Filter = 'all' | typeof Statuses.PENDING | typeof Statuses.COMPLETED
interface PersonalGoalsFilterProps {
  filter: Filter
  setFilter: Dispatch<SetStateAction<Filter>>
}

export const PersonalGoalsFilter = ({ filter, setFilter }: PersonalGoalsFilterProps) => {
  const t = useTranslations('components.PersonalGoals.Filter')
  return (
    <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
      <TabsList className="gap-3">
        <TabsTrigger value={Statuses.COMPLETED}>{t('Completed')}</TabsTrigger>
        <TabsTrigger value={Statuses.PENDING}>{t('Active')}</TabsTrigger>
        <TabsTrigger value="all">{t('All')}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
