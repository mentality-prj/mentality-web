import { ChatWithAI } from '@/components/Home/ChatWithAI'
import { DailyCard } from '@/components/Home/DailyCard'
import { ExercisesForRecovery } from '@/components/Home/ExercisesForRecovery'
import { mockDashboardDailyData, mockExercisesRecoveryData } from '@/REST/mockApi'

export default async function Home() {
  const dailyData = await mockDashboardDailyData()
  const exercisesData = await mockExercisesRecoveryData()

  return (
    <div className="flex flex-col gap-12">
      <div className="">{/* Greeting Title component */}</div>
      {/* Content ↓*/}
      <div className="flex gap-8">
        <div className="flex-col gap-8">
          <div className="">{/* current state component */}</div>
          <div className="">
            <ExercisesForRecovery exercises={exercisesData} />
          </div>
        </div>
        <div className="flex-col gap-8">
          <div className="flex gap-6">
            {dailyData.map(({ ...props }, id) => (
              <DailyCard key={id} {...props} />
            ))}
          </div>
          <div className="">
            <ChatWithAI />
          </div>
          <div className="">{/* My progress */}</div>
        </div>
      </div>
    </div>
  )
}
