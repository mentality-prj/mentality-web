import { Calendar } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import Card from '@/components/shared/Cards/Card'
import { MOODS } from '@/constants/moods'
import { STRESSES } from '@/constants/stress'
import { Tag } from '@/ds/components/Tag'
import { TooltipIcon } from '@/ds/components/TooltipIcon'
import { Link } from '@/i18n/navigation'
import { getLastMoodRecords } from '@/requests/moodRecord'

export const TodayMoodNotes = async () => {
  const session = await auth()
  const t = await getTranslations('components.TodayMoodNotes')
  const tlt = await getTranslations('components.MoodCard')
  const tm = await getTranslations('components.Mood')
  const ts = await getTranslations('components.StressLevelScale')
  const todayRecordMood = await getLastMoodRecords(session, { limit: 1, active: true })
  const todayRecord = 'error' in todayRecordMood ? [] : (todayRecordMood?.data ?? [])
  const totalRecords = todayRecord.length
  return (
    <Card title={t('title')}>
      {totalRecords > 0 ? (
        <div className="space-y-2">
          {todayRecord.map((r) => {
            const moodLevel = r.moodLevel ?? 3
            const moodIndex = Math.max(1, Math.min(5, moodLevel))
            const moodInfo = MOODS[moodIndex - 1]

            const stressLevel = r.stressLevel
            const stressInfo = STRESSES[`${stressLevel}`]
            const stressLabel = ts(stressInfo.label as string)
            const label = tm(moodInfo.label as string)
            const date = r.createdAt ? new Date(r.createdAt).toLocaleString() : ''

            const infoMoodTooltip = (
              <TooltipIcon label={`${tlt('moodTooltipLabel')}: ${label}`}>
                <Tag type={moodInfo.statusClass} text={tm(moodInfo.label)} />
              </TooltipIcon>
            )
            const infoStressTooltip = (
              <TooltipIcon label={`${tlt('stressTooltipLabel')}: ${stressLabel}`}>
                <Tag type={stressInfo.statusClass} text={ts(stressInfo.label)} />
              </TooltipIcon>
            )
            return (
              <Card
                key={r.id}
                icon={<Calendar size={12} />}
                type="ghost"
                sup={date}
                text={r.description ?? ''}
                tags={r.tags}
                tools={[infoMoodTooltip, infoStressTooltip]}
              />
            )
          })}
        </div>
      ) : (
        <div className="h-full">{t('empty')}</div>
      )}
      <Link className="text-sm text-primary underline" href="/mood-tracker#mood-records-list">
        {t('more')}
      </Link>
    </Card>
  )
}
