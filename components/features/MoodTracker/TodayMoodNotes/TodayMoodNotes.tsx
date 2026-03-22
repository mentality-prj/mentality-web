import { getLocale, getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { MoodLevelBars } from '@/components/features/MoodTracker/MoodLevelBars/MoodLevelBars'
import Card from '@/components/shared/Cards/Card'
import { ENERGIES } from '@/constants/energy'
import { FOCUSES } from '@/constants/focus'
import { MOODS } from '@/constants/moods'
import { Routes } from '@/constants/routes'
import { STRESSES } from '@/constants/stress'
import { getLastMoodRecords } from '@/requests/moodRecord'

export const TodayMoodNotes = async () => {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations('components.TodayMoodNotes')
  const tm = await getTranslations('components.Mood')
  const todayRecordMood = await getLastMoodRecords(session, { days: 1 })
  const todayRecord = 'error' in todayRecordMood ? null : (todayRecordMood?.data?.[0] ?? null)

  if (!todayRecord) {
    return (
      <Card title={t('title')} link={`${Routes.MOODTRACKER}#mood-records-list`}>
        <div className="h-full">{t('empty')}</div>
      </Card>
    )
  }

  const moodLevel = todayRecord.moodLevel ?? 3
  const moodIndex = Math.max(1, Math.min(5, moodLevel))
  const moodInfo = MOODS[moodIndex - 1]

  const stressInfo = STRESSES.find((s) => s.value === todayRecord.stressLevel) ?? STRESSES[0]
  const energyInfo = ENERGIES.find((e) => e.value === todayRecord.energyLevel) ?? ENERGIES[2]
  const focusInfo = FOCUSES.find((f) => f.value === todayRecord.focusLevel) ?? FOCUSES[2]
  const time = todayRecord.createdAt
    ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(todayRecord.createdAt))
    : ''

  return (
    <Card
      title={t('title')}
      link={`${Routes.MOODTRACKER}#mood-records-list`}
      time={time}
      subtitle={tm(moodInfo.label)}
      tags={todayRecord.tags}
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
}
