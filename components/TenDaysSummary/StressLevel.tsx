import { SunIcon } from '@/ds/icons/summary/sun'
import { Progress } from '@/ds/shadcn/progress'

import { SummaryCard } from './SummaryCard'

export const StressLevel = () => {
  return (
    <SummaryCard title="Середній рівень стресу" icon={<SunIcon />}>
      <div className="flex w-full flex-col gap-3">
        <div className="text-sm text-textcolor-tertiary">Недостатньо даних для розрахунку</div>
        <div>
          <Progress className="h-[6px] bg-surface-secondary" value={0} />
        </div>
        <div className="flex w-full justify-between text-xs/[14px] font-normal text-[#56566C]">
          <div className="">Відсутній</div>
          <div className="">Дуже високий</div>
        </div>
      </div>
    </SummaryCard>
  )
}
