import { useTranslations } from 'next-intl'

import { SectionCard } from '../ui/SectionCard'

import { BestDay } from './BestDay'
import { MoodMarks } from './MoodMarks'
import { MoodRecording } from './MoodRecording'
import { StressLevel } from './StressLevel'

export const TenDaysSummary = () => {
  const t = useTranslations('components.TenDaysSummary')
  return (
    <SectionCard className="max-w-fit p-4 laptop:p-8">
      <div className="mb-6 text-xl/[24px] font-semibold text-textcolor-primary">{t('title')}</div>
      <div className="flex items-center justify-center">
        <div className="grid auto-rows-[1fr] gap-4">
          <BestDay />
          <MoodMarks />
          <StressLevel />
          <MoodRecording />
        </div>
      </div>
    </SectionCard>
  )
}
