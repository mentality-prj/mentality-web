import { CalendarProps } from '@/types/calendar'

import { CalendarActivity } from './CalendarActivity'

export const Calendar = ({ title, subtitle, activeLabel, inactiveLabel, selectedDays }: CalendarProps) => {
  return (
    <div className="rounded-default bg-surface-white p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl/[24px] font-semibold text-textcolor-primary">{title}</h2>
        <p className="flex items-center gap-1 text-xs text-textcolor-secondary">{subtitle}</p>
      </div>
      <div className="mt-6 flex w-full justify-center">
        <CalendarActivity selectedDays={selectedDays} />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-textcolor-purple"></span>
          <span>{activeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-outline-secondary"></span>
          <span>{inactiveLabel}</span>
        </div>
      </div>
    </div>
  )
}
