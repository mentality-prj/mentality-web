import { Check, Mic, Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'

import TextareaWithLabel from '@/ds/components/TextareaWithLabel'
import { AngryEmoji } from '@/ds/icons/emoji/angry'
import { HappyEmoji } from '@/ds/icons/emoji/happy'
import { SadEmoji } from '@/ds/icons/emoji/sad'
import { SleepyEmoji } from '@/ds/icons/emoji/sleepy'
import { VerySadEmoji } from '@/ds/icons/emoji/very-sad'
import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'

const buttonList = [HappyEmoji, SadEmoji, VerySadEmoji, AngryEmoji, SleepyEmoji]

export const MoodNote = () => {
  const t = useTranslations('MoodTracker.MoodNote')

  return (
    <div className="flex w-full">
      <Card className="flex w-full flex-col gap-6 bg-surface-white">
        <CardHeader>
          <CardTitle> {t('title')} </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Card className="border-outline-secondary">
            <CardContent>
              <div className="pt-4">{t('subtitle')}</div>
              <div className="flex justify-around py-4">
                {buttonList.map((Emoji, id) => (
                  <Button key={id} size="iconSm" variant={'iconButton'}>
                    <Emoji />
                  </Button>
                ))}
              </div>
              <TextareaWithLabel rightIcon={<Mic className="h-6 w-6 text-iconcolor-secondary" />} label={t('label')} />
              <div className="flex justify-between py-4">
                <div> {t('add tags')} </div>
                <Button variant={'textButton'} size={'base'}>
                  <Pencil /> {t('change tags')}
                </Button>
              </div>
              <div>Всякі різні теги</div>
            </CardContent>
          </Card>
          <Card className="border-outline-secondary">
            <CardContent>
              <div className="py-4">Блок: обери рівень стресу</div>
            </CardContent>
          </Card>
          {/* button is disabled until user enters data */}
          <Button disabled>
            <Check /> {t('save')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
