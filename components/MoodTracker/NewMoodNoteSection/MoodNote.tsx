'use client'

import { useState } from 'react'
import { Mic } from 'lucide-react'
import { useTranslations } from 'next-intl'

import TextareaWithLabel from '@/ds/components/TextareaWithLabel'
import { Bad, Good, Neutral, VeryBad, VeryGood } from '@/ds/icons/moodNote'
import { Button } from '@/ds/shadcn/button'

import CardContainer from '../../Cards/CardContainer'

import { TagsEditor } from './AddTagsContainer'

const emojiList: Array<React.FC> = [VeryBad, Bad, Neutral, Good, VeryGood]

export const MoodNote = () => {
  const t = useTranslations('components.MoodNote')
  const [tags, setTags] = useState<string[]>(['Спорт', 'Вітаміни'])
  const labelsEmojiList: Readonly<string[]> = [
    t('labelsEmoji.veryBad'),
    t('labelsEmoji.bad'),
    t('labelsEmoji.neutral'),
    t('labelsEmoji.good'),
    t('labelsEmoji.veryGood'),
  ]

  return (
    <CardContainer>
      <div className="pt-4">{t('subtitle')}</div>
      <div className="grid grid-cols-5 px-10 py-4" style={{ gridAutoColumns: 'max-content' }}>
        {emojiList.map((Emoji, idx) => (
          <div key={idx} className="flex flex-col items-center justify-between py-5 text-center">
            <Button size="iconBig" variant="iconButton">
              <Emoji />
            </Button>
            <span className="text-textcolor-tertiary mt-2 whitespace-nowrap text-xs font-normal">
              {labelsEmojiList[`${idx}`]}
            </span>
          </div>
        ))}
      </div>

      <TextareaWithLabel rightIcon={<Mic className="text-iconcolor-secondary h-6 w-6" />} label={t('label')} />
      <div className="mt-4">
        <TagsEditor tags={tags} onChange={setTags} />
      </div>
    </CardContainer>
  )
}
