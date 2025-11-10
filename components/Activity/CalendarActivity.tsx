'use client'
import { getDefaultClassNames } from 'react-day-picker'
import { enUS, pl, uk } from 'react-day-picker/locale'
import { useLocale } from 'next-intl'

import { Calendar as ShadcnCalendar } from '@/ds/shadcn/calendar'
import { SelectedDays } from '@/types/calendar'

export const CalendarActivity = ({ selectedDays }: { selectedDays: SelectedDays }) => {
  const defaultClassNames = getDefaultClassNames()
  const locale = useLocale()

  return (
    <ShadcnCalendar
      locale={locale === 'uk' ? uk : locale === 'pl' ? pl : enUS}
      selected={selectedDays}
      showOutsideDays={true}
      weekStartsOn={1}
      components={{
        MonthCaption: () => <></>,
        PreviousMonthButton: () => <></>,
        NextMonthButton: () => <></>,
      }}
      classNames={{
        week: `${defaultClassNames.week}  mt-2 flex w-full  gap-2 `,
        weekdays: `${defaultClassNames.weekdays} flex  text-textcolor-tertiary capitalize text-sm/[16px] `,
        day: 'flex aspect-square h-8 w-8 select-none items-center justify-center rounded-xs border px-1 py-[9px] text-xs font-normal border-[#905FFF] bg-[#D4CCFF] text-textcolor-primary',
        disabled: `${defaultClassNames.disabled} data-[disabled]:border-[#8E8EA4] data-[disabled]:bg-[#F6F5FF] data-[disabled]:text-textcolor-tertiary`,
      }}
    />
  )
}
