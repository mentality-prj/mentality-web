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
  return (
    <SectionCard title="Сьогоднішний стан" subtitle="Як ти сьогодні почуваєш себе?">
      <div className="mt-4 flex flex-col gap-6">
        <div className="flex justify-between px-20 py-5">
          {buttonList.map((Emoji, id) => (
            <Button key={id} size="iconSm" variant={'iconButton'}>
              <Emoji />
            </Button>
          ))}
        </div>
        <CustomInput className="max-w-full" placeholder="Додати коротку нотатку (опціонально)" />
        <div className="flex justify-between">
          <Button variant="secondary">Подивитись динаміку</Button>
          <Button>Зберегти</Button>
        </div>
      </div>
    </SectionCard>
  )
}
