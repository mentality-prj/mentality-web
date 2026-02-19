import { Calendar, SunIcon } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import Card from '@/components/shared/Cards/Card'
import { MOODS } from '@/constants/moods'
import { STRESSES } from '@/constants/stress'
import { Tag } from '@/ds/components/Tag'
import { levelToMoodKey } from '@/mappers/mood.mappers'
import { MoodRecordEntity } from '@/types/api-responses'
import { DaySummary } from '@/types/daySummary'
import { SupportedLanguage } from '@/types/languages'

import { SummaryCard } from './SummaryCard'

interface BestDayProps {
  summaries?: DaySummary[]
  records?: MoodRecordEntity[]
}
export const BestDay = async ({ records }: BestDayProps) => {
  const t = await getTranslations('components.BestDay')
  const tm = await getTranslations('components.Mood')
  const ts = await getTranslations('components.StressLevelScale')

  // Find the best day based on average moodLevel
  let bestDate: string | null = null
  let highestAvgMood = -Infinity
  let bestDayRecords: MoodRecordEntity[] = []

  if (records && records.length > 0) {
    const dailyData: Record<string, MoodRecordEntity[]> = {}

    records.forEach((record) => {
      if (record.createdAt && typeof record.moodLevel === 'number') {
        const date = new Date(record.createdAt).toISOString().slice(0, 10)
        if (!dailyData[date as string]) {
          dailyData[date as string] = []
        }
        dailyData[date as string].push(record)
      }
    })

    Object.entries(dailyData).forEach(([date, dayRecords]) => {
      const avgMood = dayRecords.reduce((sum, r) => sum + (r.moodLevel ?? 0), 0) / dayRecords.length
      if (avgMood > highestAvgMood) {
        highestAvgMood = avgMood
        bestDate = date
        bestDayRecords = dayRecords
      }
    })
  }

  // Calculate average values for the best day
  const avgMoodLevel =
    bestDayRecords.length > 0
      ? Math.round(bestDayRecords.reduce((sum, r) => sum + (r.moodLevel ?? 0), 0) / bestDayRecords.length)
      : undefined

  const stressRecords = bestDayRecords.filter((r) => typeof r.stressLevel === 'number')
  const avgStressLevel =
    stressRecords.length > 0
      ? Math.round(stressRecords.reduce((sum, r) => sum + (r.stressLevel ?? 0), 0) / stressRecords.length)
      : undefined

  const data = bestDate
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

  let weekday = ''
  let dayMonth = ''
  if (data) {
    const parts = splitDate(data, locale)
    weekday = parts.weekday
    dayMonth = parts.dayMonth
  }

  // Get mood information
  const moodKey = avgMoodLevel ? levelToMoodKey(avgMoodLevel) : undefined
  const moodInfo = moodKey ? MOODS.find((m) => m.key === moodKey) : undefined

  // Get stress information
  const stressInfo = typeof avgStressLevel === 'number' ? STRESSES.find((s) => s.value === avgStressLevel) : undefined

  return (
    <SummaryCard iconOnTop icon={<SunIcon className="opacity-50" color="white" size="128" />}>
      {data ? (
        <Card type="joy" icon={<Calendar size={12} />} title={weekday} sup={dayMonth} tools={t('title')}>
          <div className="grid grid-cols-[auto_1fr] items-center gap-xs gap-x-sm">
            {stressInfo && (
              <>
                <div className="text-sm">{t('stressLevel')}:</div>
                <span>
                  <Tag type={stressInfo.statusClass} text={ts(stressInfo.label)} />
                </span>
              </>
            )}
            {moodInfo && (
              <>
                <div className="text-sm">{t('yourMood')}:</div>
                <span>
                  <Tag type={moodInfo.statusClass} text={tm(moodInfo.label)} />
                </span>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div className="text-sm">{t('empty')}</div>
      )}
    </SummaryCard>
  )
}
