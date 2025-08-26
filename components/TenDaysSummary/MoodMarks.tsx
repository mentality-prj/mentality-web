import { ChartIcon } from '@/ds/icons/summary/chart'

import { Badge } from '@/ds/shadcn/badge'

import { SummaryCard } from './SummaryCard'

export const MoodMarks = () => {
  return (
    <SummaryCard icon={<ChartIcon />} title="Твої відмітки настрою">
      <div className="grid auto-rows-min grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <Badge variant="colored" className="w-full bg-[#E5FFE6]">
              Дуже хороший
            </Badge>
            <span className="ml-2">-</span>
          </div>
          <div className="flex w-full justify-between">
            <Badge variant="colored" className="w-full bg-[#E5FFF8]">
              Хороший
            </Badge>
            <span className="ml-2">-</span>
          </div>
          <div className="flex w-full justify-between">
            <Badge variant="colored" className="w-full bg-[#DBE7FF]">
              Нейтральний
            </Badge>

            <span className="ml-2">-</span>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <div className="flex w-full justify-between">
            <Badge variant="colored" className="w-full bg-[#FFDFA9]">
              Поганий
            </Badge>
            <span className="ml-2">-</span>
          </div>
          <div className="flex w-full justify-between">
            <Badge variant="colored" className="w-full bg-[#F8D3D3]">
              Дуже поганий
            </Badge>

            <span className="ml-2">-</span>
          </div>
        </div>
      </div>
    </SummaryCard>
  )
}
