import { MoodNote } from '@/components/MoodTracker/MoodNote'
import { StressAssessment } from '@/components/MoodTracker/StressAssessment'
import { WeekSummary } from '@/components/MoodTracker/WeekSummary'

export default function MoodTracker() {
  return (
    <div>
      <MoodNote />
      <WeekSummary />
      <StressAssessment />
    </div>
  )
}
