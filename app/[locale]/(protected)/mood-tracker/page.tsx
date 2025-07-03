import { MoodNote } from '@/components/MoodTracker/MoodNote'
import { StressAssessment } from '@/components/MoodTracker/StressAssessment'

export default async function MoodTracker() {
  return (
    <div className="flex w-full flex-col gap-2 tablet:gap-4 desktop:flex-row desktop:gap-8">
      <div className="desktop:w-3/5">
        <MoodNote />
      </div>
      <div className="flex flex-col gap-2 tablet:gap-4 desktop:w-2/5">
        <WeekSummary />
        <StressAssessment />
      </div>
    </div>
  )
}
