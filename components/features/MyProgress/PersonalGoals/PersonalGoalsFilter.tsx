import { Dispatch, SetStateAction } from 'react'
import { useTranslations } from 'next-intl'

import { Statuses } from '@/types/goals'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs'

export type Filter = 'all' | typeof Statuses.PENDING | typeof Statuses.COMPLETED | typeof Statuses.FAILED
interface PersonalGoalsFilterProps {
  filter: Filter
  setFilter: Dispatch<SetStateAction<Filter>>
}

export const PersonalGoalsFilter = ({ filter, setFilter }: PersonalGoalsFilterProps) => {
  const t = useTranslations('components.PersonalGoals.Filter')
  return (
    <>
      <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
        <SelectTrigger className="bg-white desktop:hidden">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all" className="focus:bg-accent-soft focus:text-accent-foreground">
            {t('All')}
          </SelectItem>
          <SelectItem value={Statuses.PENDING} className="focus:bg-accent-soft focus:text-accent-foreground">
            {t('Active')}
          </SelectItem>
          <SelectItem value={Statuses.COMPLETED} className="focus:bg-accent-soft focus:text-accent-foreground">
            {t('Completed')}
          </SelectItem>
          <SelectItem value={Statuses.FAILED} className="focus:bg-accent-soft focus:text-accent-foreground">
            {t('Failed')}
          </SelectItem>
        </SelectContent>
      </Select>
      <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
        <TabsList className="hidden desktop:flex desktop:w-auto desktop:gap-xs">
          <TabsTrigger value="all">{t('All')}</TabsTrigger>
          <TabsTrigger value={Statuses.PENDING}>{t('Active')}</TabsTrigger>
          <TabsTrigger value={Statuses.COMPLETED}>{t('Completed')}</TabsTrigger>
          <TabsTrigger value={Statuses.FAILED}>{t('Failed')}</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  )
}
