import { getLocale, getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { MoodLevelBars } from '@/components/features/MoodTracker/MoodLevelBars/MoodLevelBars'
import Card from '@/components/shared/Cards/Card'
import { ENERGIES } from '@/constants/energy'
import { FOCUSES } from '@/constants/focus'
import { MOODS } from '@/constants/moods'
import { STRESSES } from '@/constants/stress'
import { getLastMoodRecords } from '@/requests/moodRecord'

export const TodayMoodNotes = async () => {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations('components.TodayMoodNotes')
  const commonGeneral = await getTranslations('common.General')
  const tm = await getTranslations('components.Mood')
  const todayRecordMood = await getLastMoodRecords(session, { limit: 1 })
  const todayRecord = 'error' in todayRecordMood ? [] : (todayRecordMood?.data ?? [])
  const totalRecords = todayRecord.length
  return (
    <Card title={t('title')} link="/mood-tracker#mood-records-list">
      {totalRecords > 0 ? (
        <div className="space-y-2">
          {todayRecord.map((r) => {
            const moodLevel = r.moodLevel ?? 3
            const moodIndex = Math.max(1, Math.min(5, moodLevel))
            const moodInfo = MOODS[moodIndex - 1]

            const stressInfo = STRESSES.find((s) => s.value === r.stressLevel) ?? STRESSES[0]
            const energyInfo = ENERGIES.find((e) => e.value === r.energyLevel) ?? ENERGIES[2]
            const focusInfo = FOCUSES.find((f) => f.value === r.focusLevel) ?? FOCUSES[2]
            const date = r.createdAt
              ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(r.createdAt))
              : ''

            return (
              <Card
                key={r.id}
                type="ghost"
                time={date}
                subtitle={`${commonGeneral('mood')} ${tm(moodInfo.label)}`}
                tags={r.tags}
              >
                <MoodLevelBars
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
        <div className="h-full">{t('empty')}</div>
      )}
    </Card>
  )
}
