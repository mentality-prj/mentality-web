import { SunIcon } from '@/ds/icons/summary/sun'

import { Days } from './Days'
import { SummaryCard } from './SummaryCard'

export const MoodRecording = () => {
  return (
    <SummaryCard title="Створено записів настрою" icon={<SunIcon />}>
      <div className="flex flex-col">
        <div className="mb-5">
          <span className="text-xl/[24px] font-semibold">0</span> за останні 10 днів
        </div>
        <Days />
      </div>
    </SummaryCard>
  )
}
