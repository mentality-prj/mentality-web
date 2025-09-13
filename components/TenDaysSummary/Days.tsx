import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

export const Days = () => {
  const t = useTranslations('components.TenDaysSummary.Days')
  const weekDays = t.raw('days')
  const days = Array.from({ length: 10 }, (_, i) => weekDays[i % weekDays.length])

  return (
    <div className="flex gap-1">
      {days.map((day, idx) => (
        <div
          key={idx}
          className={cn(
            'mt-auto flex flex-col rounded-sm border border-outline-tertiary px-[5px] text-center text-textcolor-tertiary',
            idx === 9 && 'text-textcolor-purple'
          )}
        >
          <div className="font-medium">{idx === 9 ? 0 : '-'}</div>
          <div className="text-xs/[14px]">{day}</div>
        </div>
      ))}
    </div>
  )
}
