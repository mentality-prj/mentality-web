import { GreetingTitleWrapper } from '@/components/GreetingTitle/GreetingTitleWrapper'
import { ChatWithAI } from '@/components/Home/ChatWithAI'
import { CurrentState } from '@/components/Home/CurrentState'
import { DailyCard } from '@/components/Home/DailyCard'
import { ExercisesForRecovery } from '@/components/Home/ExercisesForRecovery'
import { MyProgress } from '@/components/Home/MyProgress'
import { mockDashboardDailyData, mockExercisesRecoveryData } from '@/REST/mockApi'

export default async function Home() {
  const dailyData = await mockDashboardDailyData()
  const exercisesData = await mockExercisesRecoveryData()

  return (
    <div className="flex flex-col gap-4">
      <GreetingTitleWrapper />

      <CurrentState />

      {dailyData.map(({ ...props }, id) => (
        <DailyCard key={id} {...props} />
      ))}

      <ExercisesForRecovery exercises={exercisesData} />

      <ChatWithAI />
      <MyProgress />
    </div>
  )
}
