import { Check } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import Card from '@/components/shared/Cards/Card'
import { cn } from '@/lib/utils'
import { DaySummary } from '@/types/daySummary'
import { getRecentLocalDayKeys } from '@/utils/timeZone'

interface LastTenDaysMoodRecordsProps {
  /** Daily mood summaries for the last 10 days. Each entry contains a date (ISO YYYY-MM-DD) and a record count. */
  summaries?: DaySummary[]
  timeZone?: string
}

/**
 * Displays a 10-day mood tracking grid as a card.
 *
 * Each column represents one day (oldest → today). The bottom strip is colour-coded:
 * - **success** — at least one mood record exists for that day.
 * - **error**   — no record and the day is in the past (missed).
 * - neutral     — today, not yet recorded.
 *
 * A visually hidden `<span className="sr-only">` inside each column announces the day's
 * status to screen readers without affecting the visual layout.
 *
 * Server component — fetches locale and translations on the server.
 */
export async function LastTenDaysMoodRecords({ summaries, timeZone }: LastTenDaysMoodRecordsProps) {
  const t = await getTranslations('components.LastTenDaysMoodRecords')

  const count = Array.isArray(summaries) ? summaries.reduce((s, r) => s + (r.records ?? 0), 0) : 0
  const locale = await getLocale()

  const text = (
    <>
      <span className="text-xl/[24px] font-semibold">{count}</span> {t('content')}
    </>
  )

  const map: Record<string, number> = {}
  if (Array.isArray(summaries)) {
    for (const s of summaries) {
      if (s?.date) map[s.date] = s.records ?? 0
    }
  }

  const dates = getRecentLocalDayKeys(10, timeZone ?? null)
  const weekdayFormatter = new Intl.DateTimeFormat(locale || undefined, { weekday: 'short', timeZone: 'UTC' })
  const todayIso = dates[dates.length - 1]

  return (
    <Card title={t('title')} text={text} className="w-full">
      <div className="flex w-full flex-row gap-1">
        {dates.map((iso) => {
          const dayCount = map[iso]
          const label = weekdayFormatter.format(new Date(`${iso}T12:00:00.000Z`))
          const isToday = iso === todayIso
          const isDone = typeof dayCount === 'number' && dayCount > 0
          const isMissed = !isDone && !isToday
          return (
            <div
              key={iso}
              className={cn(
                'border-outline-tertiary text-textcolor-tertiary mt-auto flex flex-1 flex-col items-center overflow-hidden rounded-sm border text-center',
                isToday && 'info'
              )}
            >
              <div className="p-1 pb-0 text-sm">{Number(iso.slice(-2))}</div>
              <div className="p-1 text-xs">{label}</div>
              <div
                className={cn(
                  'mt-2 flex h-6 w-full items-center justify-center',
                  isDone ? 'success' : isMissed ? 'error' : ''
                )}
              >
                {isDone && <Check size={12} strokeWidth={3} />}
                <span className="sr-only">
                  {isDone ? t('status.done') : isMissed ? t('status.missed') : t('status.today')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
