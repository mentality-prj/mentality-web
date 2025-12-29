import { getTranslations } from 'next-intl/server'

import { CloudIcon } from '@/ds/icons/summary/cloud'
import { Progress } from '@/ds/shadcn/progress'
import { mockStressLevel } from '@/REST/mockApi'

import { SummaryCard } from './SummaryCard'

export const StressLevel = async () => {
  const stressLevel = await mockStressLevel()
  const t = await getTranslations('components.StressLevel')
  const getStressLabel = (level: number) => {
    switch (true) {
      case level === 0:
        return t('stressLevel', { stressLevel: 'absent' })
      case level <= 25:
        return t('stressLevel', { stressLevel: 'low' })
      case level <= 50:
        return t('stressLevel', { stressLevel: 'avarage' })
      case level <= 75:
        return t('stressLevel', { stressLevel: 'high' })
      default:
        return t('stressLevel', { stressLevel: 'very_high' })
    }
  }
  const getStressProgressColor = (level: number) => {
    switch (true) {
      case level === 0:
        return ''
      case level <= 25:
        return 'bg-[#905FFF]'
      case level <= 50:
        return 'bg-[#734CCC]'
      case level <= 75:
        return 'bg-[#563999]'
      default:
        return 'bg-[#3A2766]'
    }
  }
  return (
    <SummaryCard title={t('title')} icon={<CloudIcon />}>
      <div className="flex w-full flex-col gap-3">
        {stressLevel != null ? (
          <>
            <div className="text-xl/[24px] font-semibold text-textcolor-primary">{getStressLabel(stressLevel)}</div>
            <div>
              <Progress
                className="h-[6px] bg-background-alt-secondary"
                indicatorClassName={getStressProgressColor(stressLevel)}
                value={stressLevel}
              />
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-textcolor-tertiary">{t('empty')}</div>
            <div>
              <Progress className="h-[6px] bg-background-alt-secondary" value={0} />
            </div>
          </>
        )}
        <div className="flex w-full justify-between text-xs/[14px] font-normal text-[#56566C]">
          <div className="">{t('stressLevel', { stressLevel: 'absent' })}</div>
          <div className="">{t('stressLevel', { stressLevel: 'very_high' })}</div>
        </div>
      </div>
    </SummaryCard>
  )
}
