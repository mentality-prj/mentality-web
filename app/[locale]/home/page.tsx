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
    <div className="flex flex-col gap-8">
      <div>
        <GreetingTitleWrapper />
      </div>

      {/* Main Content */}
      <div className="mx-auto grid gap-8 xl:grid-cols-[527px_527px]">
        <div className="flex max-w-[527px] flex-col gap-8">
          <CurrentState />
          <ExercisesForRecovery exercises={exercisesData} />
        </div>
        <div className="flex max-w-[527px] flex-col gap-8">
          <div className="flex gap-6">
            {dailyData.map(({ ...props }, id) => (
              <DailyCard key={id} {...props} />
            ))}
          </div>
          <ChatWithAI />
          <MyProgress />
        </div>
      </div>
    </div>
  )
}
