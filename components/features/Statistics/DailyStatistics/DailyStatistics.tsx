import { getLocale, getTranslations } from 'next-intl/server'

import Card from '@/components/shared/Cards/Card'
import { ENERGIES } from '@/constants/energy'
import { FOCUSES } from '@/constants/focus'
import { STRESSES } from '@/constants/stress'
import { Tag } from '@/ds/components/Tag'
import { levelToMoodKey } from '@/mappers/mood.mappers'
import { MoodRecordEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'

interface DailyStatisticsProps {
  records?: MoodRecordEntity[]
}

export const DailyStatistics = async ({ records = [] }: DailyStatisticsProps) => {
  const t = await getTranslations('components.DailyCard')
  const commonMy = await getTranslations('common.My')
  const moodT = await getTranslations('components.Mood.labelsEmoji')
  const moodMeta = await getTranslations('components.Mood')
  const ts = await getTranslations('components.StressLevelScale')
  const te = await getTranslations('components.EnergyLevelScale')
  const tf = await getTranslations('components.FocusLevelScale')
  const locale = (await getLocale()) as SupportedLanguage
  const detailedDate = new Intl.DateTimeFormat(locale).format(new Date())
  const detailedTitle = commonMy('detailed', { date: detailedDate }) || t('cards.detailed', { date: detailedDate })
  const activityTitle = t('cards.activity')

  const totalRecords = records.length
  const avgMood =
    totalRecords > 0 ? (records.reduce((sum, r) => sum + (r.moodLevel ?? 0), 0) / totalRecords).toFixed(1) : '0'
  const avgStress =
    totalRecords > 0 ? (records.reduce((sum, r) => sum + (r.stressLevel ?? 0), 0) / totalRecords).toFixed(1) : '0'

  return (
    <>
      <Link href="/my-progress/statistics" title={t('linkText', { type: 'statistics' })}>
        <Card title={detailedTitle}>
          <div className="mt-2 space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('statistics.recordsForDay')}</span>
              <span className="text-lg font-semibold">{totalRecords}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('statistics.averageMood')}</span>
              <span className="text-lg font-semibold">{avgMood} / 5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('statistics.averageStress')}</span>
              <span className="text-lg font-semibold">{avgStress} / 5</span>
            </div>
          </div>
        </Card>
      </Link>

      <Card title={activityTitle} className="h-full">
        <div className="mt-2 h-full rounded bg-gray-50 p-4">
          {totalRecords > 0 ? (
            <div className="space-y-2">
              {records.map((record) => {
                const moodKey = record.moodLevel ? levelToMoodKey(record.moodLevel) : undefined
                const moodLabel = moodKey ? moodT(moodKey === 'great' ? 'veryGood' : moodKey) : 'N/A'
                const stressInfo = STRESSES.find((s) => s.value === record.stressLevel) ?? STRESSES[0]
                const energyInfo = ENERGIES.find((e) => e.value === record.energyLevel) ?? ENERGIES[2]
                const focusInfo = FOCUSES.find((f) => f.value === record.focusLevel) ?? FOCUSES[2]

                return (
                  <div key={record.id} className="rounded border border-gray-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {t('statistics.mood')} {moodLabel}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-xs">
                      <span className="text-xs text-gray-500">{moodMeta('stressLabel')}:</span>
                      <Tag type={stressInfo.statusClass} text={ts(stressInfo.label as string)} />
                      <span className="text-xs text-gray-500">{moodMeta('energyLabel')}:</span>
                      <Tag type={energyInfo.statusClass} text={te(energyInfo.label as string)} />
                      <span className="text-xs text-gray-500">{moodMeta('focusLabel')}:</span>
                      <Tag type={focusInfo.statusClass} text={tf(focusInfo.label as string)} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">{t('statistics.noRecordsToday')}</p>
          )}
        </div>
      </Card>
    </>
  )
}
