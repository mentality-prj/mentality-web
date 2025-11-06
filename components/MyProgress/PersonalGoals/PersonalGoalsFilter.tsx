import { Dispatch, SetStateAction } from 'react'
import { useTranslations } from 'next-intl'

import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

export type Filter = 'all' | 'pending' | 'completed'
interface PersonalGoalsFilterProps {
  filter: Filter
  setFilter: Dispatch<SetStateAction<Filter>>
}

export const PersonalGoalsFilter = ({ filter, setFilter }: PersonalGoalsFilterProps) => {
  const t = useTranslations('components.PersonalGoals.Filter')
  return (
    <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
      <TabsList className="gap-3">
        <TabsTrigger value="completed">{t('Completed')}</TabsTrigger>
        <TabsTrigger value="pending">{t('Active')}</TabsTrigger>
        <TabsTrigger value="all">{t('All')}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
