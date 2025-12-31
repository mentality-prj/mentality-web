import { CalendarProps } from '@/types/calendar'

import { CalendarActivity } from './CalendarActivity'

export const Calendar = ({ title, subtitle, activeLabel, inactiveLabel, selectedDays }: CalendarProps) => {
  return (
    <div className="background-alt-white rounded p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl/[24px] font-semibold text-textcolor-primary">{title}</h2>
        <>{subtitle}</>
      </div>
      <div className="mt-6 flex w-full justify-center">
        <CalendarActivity selectedDays={selectedDays} />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-textcolor-purple h-3 w-3 rounded-full"></span>
          <span>{activeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="border-outline-secondary h-3 w-3 rounded-full border"></span>
          <span>{inactiveLabel}</span>
        </div>
      </div>
    </div>
  )
}
