import { useTranslations } from 'next-intl'

import { CustomCard } from '@/ds/components/CustomCard'
import { ArrowRightIcon } from '@/ds/icons/arrow-right'
import { FireEmoji } from '@/ds/icons/emoji/fire'

import { SectionCard } from '../ui/SectionCard'

export const MyProgress = () => {
  const t = useTranslations('HomePage.MyProgress')
  return (
    <SectionCard title={t('title')} subtitle={t('subtitle')}>
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex gap-3">
          <div className="rounded-md bg-surface-action p-3">
            <FireEmoji />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm">{t('Ribbon of achievements:')}</div>
            <div className="text-xl/6">3 {t('days in a row!')}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CustomCard
            className="max-w-full"
            variant="link"
            href="/"
            title={t('Mood analytics')}
            icon={<ArrowRightIcon />}
          />
          <CustomCard
            className="max-w-full"
            variant="link"
            href="/"
            title={t('Personal tips')}
            icon={<ArrowRightIcon />}
          />
        </div>
      </div>
    </SectionCard>
  )
}
