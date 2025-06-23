import { useTranslations } from 'next-intl'

import { CustomInput } from '@/ds/components/CustomInput'
import { AngryEmoji } from '@/ds/icons/emoji/angry'
import { HappyEmoji } from '@/ds/icons/emoji/happy'
import { SadEmoji } from '@/ds/icons/emoji/sad'
import { SleepyEmoji } from '@/ds/icons/emoji/sleepy'
import { VerySadEmoji } from '@/ds/icons/emoji/very-sad'
import { Button } from '@/ds/shadcn/button'

import { SectionCard } from '../ui/SectionCard'

const buttonList = [HappyEmoji, SadEmoji, VerySadEmoji, AngryEmoji, SleepyEmoji]

export const CurrentState = () => {
  const t = useTranslations('HomePage.CurrentState')
  return (
    <SectionCard title={t('title')} subtitle={t('subtitle')}>
      <div className="mt-4 flex flex-col gap-6">
        <div className="mx-auto flex w-full justify-around px-2 py-5">
          {buttonList.map((Emoji, id) => (
            <Button key={id} size="iconSm" variant={'iconButton'}>
              <Emoji />
            </Button>
          ))}
        </div>
        <CustomInput className="max-w-full" placeholder={t('placeholder')} />
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <Button variant="secondary">{t('View dynamics')}</Button>
          <Button>{t('Save')}</Button>
        </div>
      </div>
    </SectionCard>
  )
}
