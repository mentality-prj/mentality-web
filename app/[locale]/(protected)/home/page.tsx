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

      <div className="flex flex-col gap-4 laptop:grid laptop:grid-cols-2">
        <CurrentState />

        <div className="grid items-stretch justify-items-stretch gap-4 tablet:grid-cols-2 laptop:grid-cols-1">
          {dailyData.map((props, id) => (
            <DailyCard key={id} {...props} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 laptop:grid-cols-2">
        <ExercisesForRecovery exercises={exercisesData} />

        <ChatWithAI />
        <MyProgress className="desktop:col-start-2" />
      </div>
    </div>
  )
}
