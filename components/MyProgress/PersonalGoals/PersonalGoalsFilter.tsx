import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

export const PersonalGoalsFilter = () => {
  return (
    <Tabs defaultValue="All">
      <TabsList className="gap-3">
        <TabsTrigger value="Completed">Виконані</TabsTrigger>
        <TabsTrigger value="Active">Активні</TabsTrigger>
        <TabsTrigger value="All">Всі</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
