import { DailyCard } from '@/components/Home/DailyCard'
import { mockDashboardDailyData } from '@/REST/mockApi'

export default async function Home() {
  const dailyData = await mockDashboardDailyData()
  return (
    <div className="flex flex-col gap-12">
      <div className="">{/* Greeting Title component */}</div>
      {/* Content ↓*/}
      <div className="flex gap-8">
        <div className="flex-col gap-8">
          <div className="">{/* current state component */}</div>
          <div className="">{/* exercises for recovery */}</div>
        </div>
        <div className="flex-col gap-8">
          <div className="flex gap-6">
            {dailyData.map(({ ...props }, id) => (
              <DailyCard key={id} {...props} />
            ))}
          </div>
          <div className="">{/* Chat with an AI assistant compoent */}</div>
          <div className="">{/* My progress */}</div>
        </div>
      </div>
    </div>
  )
}
