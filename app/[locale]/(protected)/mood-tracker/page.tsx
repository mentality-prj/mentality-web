import { MoodNote } from '@/components/MoodTracker/MoodNote'
import { TenDaysSummary } from '@/components/TenDaysSummary'

export default async function MoodTracker() {
  return (
    <div className="flex w-full flex-col gap-2 tablet:gap-4 desktop:flex-row desktop:gap-8">
      <div className="desktop:w-3/5">
        <MoodNote />
      </div>
      <div className="flex flex-col gap-2 tablet:gap-4">
        <TenDaysSummary />
      </div>
    </div>
  )
}
