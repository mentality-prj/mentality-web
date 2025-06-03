import { useTranslations } from 'next-intl'

import { CustomCard } from '@/ds/components/CustomCard'
import { CloudEmoji } from '@/ds/icons/emoji/cloud'
import { HeartEmoji } from '@/ds/icons/emoji/heart'
import { HumanEmoji } from '@/ds/icons/emoji/human'

import { SectionCard } from '../ui/SectionCard'

export const ChatWithAI = () => {
  const t = useTranslations('HomePage.ChatWithAI')
  return (
    <SectionCard title={t('title')} subtitle={t('subtitle')}>
      <div className="mt-2 flex flex-col gap-6">
        <div className="rounded-md bg-surface-action p-3">&quot;{t('description')}&quot;</div>
        <div className="flex flex-col gap-2">
          <CustomCard
            variant="small"
            className="max-w-full"
            title={t('Talk about my thoughts')}
            icon={<CloudEmoji />}
          />
          <CustomCard
            variant="small"
            className="max-w-full"
            title={t('Advise me on an exercise')}
            icon={<HumanEmoji />}
          />
          <CustomCard
            variant="small"
            className="max-w-full"
            title={t('Show the caring message of the day')}
            icon={<HeartEmoji />}
          />
        </div>
      </div>
    </SectionCard>
  )
}
