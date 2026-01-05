import { getLocale, getTranslations } from 'next-intl/server'

import DailyAffirmationClient from '@/components/Affirmations/DailyAffirmationClient'
import Card from '@/components/Cards/Card'
import MoodSummaryCard from '@/components/MoodTracker/MoodSummaryCard'
import { mockDailyTip, mockMoodCounts } from '@/REST/mockApi'
import { SupportedLanguage } from '@/types/languages'

const MyDay = async () => {
  const t = await getTranslations('components.DailyCard')
  const commonMy = await getTranslations('common.My')
  const dailyTip = await mockDailyTip()
  const locale = (await getLocale()) as SupportedLanguage
  const detailedDate = new Intl.DateTimeFormat(locale).format(new Date())
  const moodCounts = await mockMoodCounts()

  return (
    <article className="grid gap-4 laptop:grid-cols-2">
      <MoodSummaryCard title={t('greeting')} subtitle={t('greetingText')} counts={moodCounts} />

      <section className="grid grid-cols-3 gap-4">
        <Card
          title={t('title', { type: 'tip' })}
          text={`${dailyTip.translations[`${locale}`]}`}
          className="col-span-3"
        />

        <div className="col-span-2">
          <DailyAffirmationClient />
        </div>

        <div className="flex flex-col gap-4">
          <Card title={t('cards.notes')}></Card>
          <Card title={t('cards.tests')}></Card>
        </div>

        <div className="col-span-2" />
      </section>

      <Card title={commonMy('detailed', { date: detailedDate }) || t('cards.detailed', { date: detailedDate })}>
        <div className="mt-2 h-40 rounded bg-gradient-to-b from-violet-50 to-transparent" />
      </Card>

      <Card title={t('cards.activity')} className="h-full">
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
    </article>
  )
}

export default MyDay
