import { SunIcon } from '@/ds/icons/summary/sun'
import { Badge } from '@/ds/shadcn/badge'

import { SummaryCard } from './SummaryCard'

export const MoodMarks = () => {
  return (
    <SummaryCard icon={<SunIcon />} title="Твої відмітки настрою">
      <div className="grid auto-rows-min grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <Badge className="w-full">Дуже хороший</Badge>
            <span className="ml-2">-</span>
          </div>
          <div className="flex w-full justify-between">
            <Badge className="w-full">Нейтральний</Badge>
            <span className="ml-2">-</span>
          </div>
          <div className="flex w-full justify-between">
            <Badge className="w-full">Дуже поганий</Badge>
            <span className="ml-2">-</span>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <div className="flex w-full justify-between">
            <Badge className="w-full">Хороший</Badge>
            <span className="ml-2">-</span>
          </div>
          <div className="flex w-full justify-between">
            <Badge className="w-full">Поганий</Badge>
            <span className="ml-2">-</span>
          </div>
        </div>
      </div>
    </SummaryCard>
  )
}
