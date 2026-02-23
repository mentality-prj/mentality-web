import { Brain, Calendar, Thermometer } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Card from '@/components/shared/Cards/Card'
import { MOODS } from '@/constants/moods'
import { STRESSES } from '@/constants/stress'
import { TooltipIcon } from '@/ds/components/TooltipIcon'
import { MoodRecordEntity } from '@/types/api-responses'

type MoodCardProps = {
  record: MoodRecordEntity
}
const moodColors = ['#fa6e6e', '#f5c678', '#7aa7ff', '#9effe6', '#95f598'] as const
function getColor(index: number, type: 'mood' | 'stress'): string {
  if (type === 'mood') {
    return moodColors[`${index}`]
  } else {
    return moodColors[moodColors.length - 1 - index]
  }
}

export const MoodCard = async ({ record }: MoodCardProps) => {
  const tlt = await getTranslations('components.MoodCard')
  const tcm = await getTranslations('components.Mood')
  const tcs = await getTranslations('components.StressLevelScale')
  const moodLevel = record.moodLevel ?? 3
  const moodIndex = Math.max(1, Math.min(5, moodLevel))
  const moodInfo = MOODS[moodIndex - 1]
  const stressLevel = record.stressLevel
  const stressInfo = STRESSES[`${stressLevel}`]
  const stressLabel = tcs(stressInfo.label as string)
  const label = tcm(moodInfo.label as string)
  const date = record.createdAt ? new Date(record.createdAt).toLocaleString() : ''

  const infoMoodTooltip = (
    <TooltipIcon label={`${tlt('moodTooltipLabel')}: ${label}`}>
      <Brain color={getColor(moodLevel - 1, 'mood')} size={24} />
    </TooltipIcon>
  )
  const infoStressTooltip = (
    <TooltipIcon label={`${tlt('stressTooltipLabel')}: ${stressLabel}`}>
      <Thermometer color={getColor(stressLevel, 'stress')} size={24} />
    </TooltipIcon>
  )

  return (
    <Card
      icon={<Calendar size={12} />}
      type="ghost"
      sup={date}
      className="w-full bg-gradient-to-r from-teal-100 via-emerald-100 to-white"
      text={record.description ?? ''}
      tags={record.tags}
      tools={[infoMoodTooltip, infoStressTooltip]}
    />
  )
}
