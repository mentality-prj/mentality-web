import { getLocale, getTranslations } from 'next-intl/server'

import { MoodLevelBars } from '@/components/features/MoodTracker/MoodLevelBars/MoodLevelBars'
import Card from '@/components/shared/Cards/Card'
import { ENERGIES } from '@/constants/energy'
import { FOCUSES } from '@/constants/focus'
import { Routes } from '@/constants/routes'
import { STRESSES } from '@/constants/stress'
import { levelToMoodKey } from '@/mappers/mood.mappers'
import { MoodRecordEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'

interface DailyStatisticsProps {
  records?: MoodRecordEntity[]
}

export const DailyStatistics = async ({ records = [] }: DailyStatisticsProps) => {
  const t = await getTranslations('components.DailyCard')
  const commonMy = await getTranslations('common.My')
  const commonGeneral = await getTranslations('common.General')
  const moodT = await getTranslations('components.Mood.labelsEmoji')
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
      <Card title={detailedTitle} link={Routes.MYPROGRESSSTATISTICS}>
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

      <div className="flex h-full flex-col gap-sm">
        <h3 className="text-xl">{activityTitle}</h3>
        {totalRecords > 0 ? (
          <div className="space-y-2">
            {records.map((record) => {
              const moodKey = record.moodLevel ? levelToMoodKey(record.moodLevel) : undefined
              const moodLabel = moodKey ? moodT(moodKey === 'great' ? 'veryGood' : moodKey) : 'N/A'
              const stressInfo = STRESSES.find((s) => s.value === record.stressLevel) ?? STRESSES[0]
              const energyInfo = ENERGIES.find((e) => e.value === record.energyLevel) ?? ENERGIES[2]
              const focusInfo = FOCUSES.find((f) => f.value === record.focusLevel) ?? FOCUSES[2]

              return (
                <Card key={record.id} subtitle={`${commonGeneral('mood')} ${moodLabel}`}>
                  <MoodLevelBars
                    className="mt-2"
                    stressValue={stressInfo.value}
                    stressColor={stressInfo.color}
                    energyValue={energyInfo.value}
                    energyColor={energyInfo.color}
                    focusValue={focusInfo.value}
                    focusColor={focusInfo.color}
                  />
                </Card>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">{t('statistics.noRecordsToday')}</p>
        )}
      </div>
    </>
  )
}
