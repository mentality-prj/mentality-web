import { getTranslations } from 'next-intl/server'

import { cn } from '@/lib/utils'

interface MoodLevelBarsProps {
  stressValue: number
  stressColor: string
  energyValue: number
  energyColor: string
  focusValue: number
  focusColor: string
  className?: string
}

export const MoodLevelBars = async ({
  stressValue,
  stressColor,
  energyValue,
  energyColor,
  focusValue,
  focusColor,
  className,
}: MoodLevelBarsProps) => {
  const commonGeneral = await getTranslations('common.General')

  return (
    <div className={cn('grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1', className)}>
      <span className="text-xs text-gray-500">{commonGeneral('stress')}</span>
      <div className="relative h-2.5 overflow-hidden rounded-sm bg-gray-100">
        <div
          className="absolute inset-y-0 left-0 rounded-sm"
          style={{ width: `${stressValue * 20}%`, backgroundColor: stressColor }}
        />
      </div>
      <span className="text-xs text-gray-500">{commonGeneral('energy')}</span>
      <div className="relative h-2.5 overflow-hidden rounded-sm bg-gray-100">
        <div
          className="absolute inset-y-0 left-0 rounded-sm"
          style={{ width: `${energyValue * 20}%`, backgroundColor: energyColor }}
        />
      </div>
      <span className="text-xs text-gray-500">{commonGeneral('focus')}</span>
      <div className="relative h-2.5 overflow-hidden rounded-sm bg-gray-100">
        <div
          className="absolute inset-y-0 left-0 rounded-sm"
          style={{ width: `${focusValue * 20}%`, backgroundColor: focusColor }}
        />
      </div>
    </div>
  )
}
