import { CustomCard } from '@/ds/components/CustomCard'
import { CloudEmoji } from '@/ds/icons/emoji/cloud'
import { HeartEmoji } from '@/ds/icons/emoji/heart'
import { HumanEmoji } from '@/ds/icons/emoji/human'

import { SectionCard } from '../ui/SectionCard'

export const ChatWithAI = () => {
  return (
    <SectionCard title="Чат з AI-помічником" subtitle="Отримай підтримку та поради">
      <div className="mt-2 flex flex-col gap-6">
        <div className="rounded-md bg-surface-action p-3">&quot;Привіт! Чим я можу допомогти сьогодні?&quot;</div>
        <div className="flex flex-col gap-2">
          <CustomCard variant="small" className="max-w-full" title="Поговорити про мої думки" icon={<CloudEmoji />} />
          <CustomCard variant="small" className="max-w-full" title="Порадь мені вправу" icon={<HumanEmoji />} />
          <CustomCard
            variant="small"
            className="max-w-full"
            title="Покажи турботливе повідомлення дня"
            icon={<HeartEmoji />}
          />
        </div>
      </div>
    </SectionCard>
  )
}
