'use client'
import { getDefaultClassNames } from 'react-day-picker'
import { enUS, pl, uk } from 'react-day-picker/locale'
import { useLocale } from 'next-intl'

import { Calendar as ShadcnCalendar } from '@/ds/shadcn/calendar'
import { SelectedDays } from '@/types/calendar'
import { isAfter, startOfToday } from 'date-fns'

export const CalendarActivity = ({ selectedDays }: { selectedDays: SelectedDays }) => {
  const defaultClassNames = getDefaultClassNames()
  const locale = useLocale()
  const today = startOfToday()

  return (
    <ShadcnCalendar
      locale={locale === 'uk' ? uk : locale === 'pl' ? pl : enUS}
      showOutsideDays={true}
      weekStartsOn={1}
      components={{
        MonthCaption: () => <></>,
        PreviousMonthButton: () => <></>,
        NextMonthButton: () => <></>,
      }}
      modifiers={{ activeDays: selectedDays }}
      hidden={(date) => isAfter(date, today)}
      classNames={{
        week: `${defaultClassNames.week}  mt-1 flex w-full  gap-1 `,
        weekdays: `${defaultClassNames.weekdays} flex  text-textcolor-tertiary capitalize text-sm/[16px] `,
        day: 'flex aspect-square h-8 w-8 select-none items-center justify-center rounded-xs border px-1 py-[9px] text-xs font-normal border-outline-secondary bg-secondary text-textcolor-tertiary',
        today: ` ${defaultClassNames.today}  border-2`,
        hidden: 'visible border-0 bg-surface-primary',
      }}
      modifiersClassNames={{
        activeDays: 'bg-accent-action border-primary !text-primary',
      }}
    />
  )
}
