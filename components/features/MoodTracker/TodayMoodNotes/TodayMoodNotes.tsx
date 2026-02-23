import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { MoodCard } from '@/components/features/MoodTracker/MoodCard/MoodCard'
import Card from '@/components/shared/Cards/Card'
import { Link } from '@/i18n/navigation'
import { getLastMoodRecords } from '@/requests/moodRecord'

export const TodayMoodNotes = async () => {
  const session = await auth()
  const t = await getTranslations('components.TodayMoodNotes')
  const todayRecordMood = await getLastMoodRecords(session, { limit: 1, active: true })
  const todayRecord = 'error' in todayRecordMood ? [] : (todayRecordMood?.data ?? [])
  const totalRecords = todayRecord.length
  return (
    <Card title={t('title')}>
      {totalRecords > 0 ? (
        <div className="space-y-2">
          {todayRecord.map((r) => (
            <MoodCard key={r.id} record={r} />
          ))}
        </div>
      ) : (
        <div className="h-full">{t('empty')}</div>
      )}
      <Link className="mt-auto underline" href="/mood-tracker#mood-records-list">
        {t('more')}
      </Link>
    </Card>
  )
}
