import { getLocale, getTranslations } from 'next-intl/server'

import { IconKey, iconsMap } from '@/components/icons/iconsMap'
import { MedalCircleIcon } from '@/ds/icons/medal-circle'
import { Progress } from '@/ds/shadcn/progress'
import { cn } from '@/lib/utils'
import { Achievements } from '@/types/achievements'
import { SupportedLanguage } from '@/types/languages'

export const AchievementCard = async ({
  icon,
  title,
  description,
  status,
  progress,
  currentProgress,
}: Achievements) => {
  const Icon = iconsMap[icon as IconKey]
  const locale = (await getLocale()) as SupportedLanguage
  const t = await getTranslations('components.Achievements.AchievementCard')
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-md border-outline-secondary text-center shadow-none',
        status === 'unlocked' && 'border-textcolor-purple bg-background-alt-action'
      )}
    >
      <div className="items-center space-y-1">
        <Icon />
        <div className="text-base">{title[`${locale}`]}</div>
        <div>{description[`${locale}`]}</div>
      </div>
      <div className="">
        {status === 'unlocked' ? (
          <div className="flex w-full flex-col items-center text-textcolor-purple [&_svg]:size-12">
            <MedalCircleIcon />
            <div className="">{t('open')}</div>
          </div>
        ) : status === 'locked' ? (
          <div className="w-full">
            <div className="flex justify-between text-xs/[14px] text-textcolor-tertiary">
              <div className="">{t('progress')}</div>
              <div className="">
                {currentProgress}/{progress}
              </div>
            </div>
            <Progress className="mt-2 h-[6px] bg-background-alt-secondary" value={(currentProgress / progress) * 100} />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
