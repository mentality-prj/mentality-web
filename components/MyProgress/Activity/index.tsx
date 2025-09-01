'use client'
import { getDefaultClassNames } from 'react-day-picker'

import { Calendar } from '@/ds/shadcn/calendar'

export const Activity = () => {
  const defaultClassNames = getDefaultClassNames()

  return (
    <Calendar
      disabled={[new Date()]}
      showOutsideDays={false}
      weekStartsOn={1}
      components={{
        MonthCaption: () => <> </>,

        PreviousMonthButton: () => <> </>,
        NextMonthButton: () => <> </>,
      }}
      classNames={{
        week: `${defaultClassNames.week}  mt-2 flex w-full  gap-2 `,
        weekdays: `${defaultClassNames.weekdays} flex  text-textcolor-tertiary`,
        day: 'flex aspect-square h-8 w-8 select-none items-center justify-center rounded-xs border px-1 py-[9px] text-xs font-normal border-[#905FFF] bg-[#D4CCFF] text-textcolor-primary',

        disabled: `${defaultClassNames.disabled} data-[disabled]:border-[#8E8EA4] data-[disabled]:bg-[#F6F5FF] data-[disabled]:text-textcolor-tertiary`,
      }}
    />
  )
}
