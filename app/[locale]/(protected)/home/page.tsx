import { GreetingTitleWrapper } from '@/components/GreetingTitle/GreetingTitleWrapper'
import { DailyCard } from '@/components/DailyCard'
import { mockDailyAffirmation, mockDailyTip } from '@/REST/mockApi'

export default async function Home() {
  const dailyAffirmation = await mockDailyAffirmation()
  const dailyTip = await mockDailyTip()

  return (
    <div className="flex flex-col gap-4">
      <GreetingTitleWrapper />

      <div className="flex flex-col gap-4 laptop:grid laptop:grid-cols-2">
        <div className="grid items-stretch justify-items-stretch gap-4 tablet:grid-cols-2 laptop:grid-cols-1">
          <DailyCard type="affirmation" {...dailyAffirmation} />
          <DailyCard type="tip" {...dailyTip} />
        </div>
      </div>
    </div>
  )
}
