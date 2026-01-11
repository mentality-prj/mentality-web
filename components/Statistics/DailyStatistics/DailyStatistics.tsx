import { getLocale, getTranslations } from 'next-intl/server'

import Card from '@/components/Cards/Card'
import { SupportedLanguage } from '@/types/languages'

const DailyStatistics = async () => {
  const t = await getTranslations('components.DailyCard')
  const commonMy = await getTranslations('common.My')
  const locale = (await getLocale()) as SupportedLanguage
  const detailedDate = new Intl.DateTimeFormat(locale).format(new Date())
  const detailedTitle = commonMy('detailed', { date: detailedDate }) || t('cards.detailed', { date: detailedDate })
  const activityTitle = t('cards.activity')

  return (
    <>
      <Card title={detailedTitle}>
        <div className="mt-2 h-40 rounded bg-gradient-to-b from-violet-50 to-transparent" />
      </Card>

      <Card title={activityTitle} className="h-full">
        <div className="mt-2 h-full rounded bg-gray-50 p-4">
          {/* calendar placeholder */}
          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="flex h-8 items-center justify-center rounded border border-gray-200 bg-white/80">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}

export default DailyStatistics
