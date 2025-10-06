'use client'

import { useState } from 'react'
import { Check, Mic } from 'lucide-react'
import { useTranslations } from 'next-intl'

import TextareaWithLabel from '@/ds/components/TextareaWithLabel'
import { AngryEmoji } from '@/ds/icons/emoji/angry'
import { HappyEmoji } from '@/ds/icons/emoji/happy'
import { SadEmoji } from '@/ds/icons/emoji/sad'
import { SleepyEmoji } from '@/ds/icons/emoji/sleepy'
import { VerySadEmoji } from '@/ds/icons/emoji/very-sad'
import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'

import { TagsEditor } from './AddTagsContainer'
import { StressLevelScale } from './StressLevelScale'

const buttonList = [HappyEmoji, SadEmoji, VerySadEmoji, AngryEmoji, SleepyEmoji]

export const MoodNote = () => {
  const t = useTranslations('MoodTracker.MoodNote')
  const [tags, setTags] = useState<string[]>(['Спорт', 'Вітаміни'])

  return (
    <div className="flex w-full tablet:min-w-[500px]">
      <Card className="flex w-full flex-col bg-surface-white">
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
              <TagsEditor tags={tags} onChange={setTags} />
            </CardContent>
          </Card>
          <Card className="border-outline-secondary">
            <CardHeader>
              <CardTitle> {t('title')} </CardTitle>
            </CardHeader>
            <CardContent>
              <StressLevelScale />
              <div className="m-4 flex justify-between gap-4 rounded-sm bg-secondary p-4">
                <span>bcgdrghdrli erksjgblrkdg f dg htrh g th kjrglkerdg akrjgbearg aekrjgb rgjkgbekjc</span>
                <Button variant="textButton" size="base">
                  button
                </Button>
              </div>
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
