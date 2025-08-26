import { SectionCard } from '../ui/SectionCard'

import { BestDay } from './BestDay'
import { MoodMarks } from './MoodMarks'
import { MoodRecording } from './MoodRecording'
import { StressLevel } from './StressLevel'

export const TenDaysSummary = () => {
  return (
    <SectionCard className="max-w-[480px] p-8">
      <div className="mb-6 text-xl/[24px] font-semibold text-textcolor-primary">Підсумок за 10 днів</div>
      <div className="grid auto-rows-[1fr] gap-4">
        <BestDay />
        <MoodMarks />
        <StressLevel />
        <MoodRecording />
      </div>
    </SectionCard>
  )
}
