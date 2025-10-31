import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'
import { Dispatch, SetStateAction } from 'react'

export type Filter = 'all' | 'pending' | 'completed'
interface PersonalGoalsFilterProps {
  filter: Filter
  setFilter: Dispatch<SetStateAction<Filter>>
}

export const PersonalGoalsFilter = ({ filter, setFilter }: PersonalGoalsFilterProps) => {
  return (
    <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
      <TabsList className="gap-3">
        <TabsTrigger value="completed">Виконані</TabsTrigger>
        <TabsTrigger value="pending">Активні</TabsTrigger>
        <TabsTrigger value="all">Всі</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
