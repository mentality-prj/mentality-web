import { getLocale } from 'next-intl/server'

import { SunIcon } from '@/ds/icons/summary/sun'
import { mockBestDay } from '@/REST/mockApi'
import { SupportedLanguage } from '@/types/languages'

import { MoodBadge } from './MoodBadge'
import { SummaryCard } from './SummaryCard'

export const BestDay = async () => {
  const data = await mockBestDay()
  const locale = (await getLocale()) as SupportedLanguage
  function splitDate(dateStr: string, locale: SupportedLanguage) {
    const date = new Date(dateStr)

    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' })
    const dayMonthFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
    })

    const weekday = weekdayFormatter.format(date)
    const dayMonth = dayMonthFormatter.format(date)

    return {
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      dayMonth,
    }
  }

  const { weekday, dayMonth } = splitDate(data.date, locale)
  return (
    <SummaryCard icon={<SunIcon />} title="Твій найкращий день">
      {data ? (
        <div className="w-fit">
          <div className="mb-4 mt-5 text-xl/[24px] font-semibold text-textcolor-primary">
            {`${weekday} `}
            <span className="text-sm font-normal">{dayMonth}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="">Рівень стресу</div>
            <MoodBadge data={data.stress} />
            <div className="">Твій настрій</div>
            <MoodBadge data={data.mood} />
          </div>
        </div>
      ) : (
        <div className="text-sm text-textcolor-tertiary">
          Твій найкращий день ще попереду!Відмічай настрій, щоб побачити його тут
        </div>
      )}
    </SummaryCard>
  )
}
