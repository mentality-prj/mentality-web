import { getLocale, getTranslations } from 'next-intl/server'

import Card from '@/components/shared/Cards/Card'
import { Routes } from '@/constants/routes'
import { MoodRecordEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'

interface DailyStatisticsProps {
  records?: MoodRecordEntity[]
}

export const DailyStatistics = async ({ records = [] }: DailyStatisticsProps) => {
  const t = await getTranslations('components.DailyCard')
  const commonMy = await getTranslations('common.My')

  const locale = (await getLocale()) as SupportedLanguage
  const detailedDate = new Intl.DateTimeFormat(locale).format(new Date())
  const detailedTitle = commonMy('detailed', { date: detailedDate }) || t('cards.detailed', { date: detailedDate })

  const totalRecords = records.length
  const avgMood =
    totalRecords > 0 ? (records.reduce((sum, r) => sum + (r.moodLevel ?? 0), 0) / totalRecords).toFixed(1) : '0'
  const avgStress =
    totalRecords > 0 ? (records.reduce((sum, r) => sum + (r.stressLevel ?? 0), 0) / totalRecords).toFixed(1) : '0'

  return (
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
  )
}
