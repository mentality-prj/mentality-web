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
        'border-outline-secondary flex flex-col justify-between rounded-md text-center shadow-none',
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
          <div className="text-textcolor-purple flex w-full flex-col items-center [&_svg]:size-12">
            <MedalCircleIcon />
            <div className="">{t('open')}</div>
          </div>
        ) : status === 'locked' ? (
          <div className="w-full">
            <div className="text-textcolor-tertiary flex justify-between text-xs/[14px]">
              <div className="">{t('progress')}</div>
              <div className="">
                {currentProgress}/{progress}
              </div>
            </div>
            <Progress className="bg-background-alt-secondary mt-2 h-[6px]" value={(currentProgress / progress) * 100} />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
