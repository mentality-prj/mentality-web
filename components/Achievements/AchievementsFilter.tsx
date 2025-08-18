import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

export const AchievementsFilter = () => {
  return (
    <Tabs>
      <TabsList className="gap-3">
        <TabsTrigger value="Відкриті">Відкриті</TabsTrigger>
        <TabsTrigger value="Невідкриті">Невідкриті</TabsTrigger>
        <TabsTrigger value="Всі">Всі</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
