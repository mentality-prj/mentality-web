import { MoodNote } from '@/components/MoodTracker/MoodNote'
import { StressAssessment } from '@/components/MoodTracker/StressAssessment'

export default async function MoodTracker() {
  return (
    <div className="flex w-full flex-col gap-2 tablet:gap-4 desktop:flex-row desktop:gap-8">
      <MoodNote />
      <div className="flex h-full w-full flex-col gap-2 tablet:gap-4">
        <StressAssessment />
      </div>
    </div>
  )
}
