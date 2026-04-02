import { getTranslations } from 'next-intl/server'

import { MoodLevelBars } from '@/components/features/MoodTracker/MoodLevelBars/MoodLevelBars'
import Card from '@/components/shared/Cards/Card'
import { ENERGIES } from '@/constants/energy'
import { FOCUSES } from '@/constants/focus'
import { STRESSES } from '@/constants/stress'
import { levelToMoodKey } from '@/mappers/mood.mappers'
import { MoodRecordEntity } from '@/types/api-responses'

type YourActivityProps = {
  records?: MoodRecordEntity[]
}

export const YourActivity = async ({ records = [] }: YourActivityProps) => {
  const t = await getTranslations('components.DailyCard')
  const commonGeneral = await getTranslations('common.General')
  const moodT = await getTranslations('components.Mood.labelsEmoji')
  const activityTitle = t('cards.activity')
  const totalRecords = records.length
  return (
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
  )
}
