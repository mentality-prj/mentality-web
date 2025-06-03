import { CustomCard } from '@/ds/components/CustomCard'
import { ArrowRightIcon } from '@/ds/icons/arrow-right'
import { FireEmoji } from '@/ds/icons/emoji/fire'

import { SectionCard } from '../ui/SectionCard'

export const MyProgress = () => {
  return (
    <SectionCard title="Мій прогрес" subtitle="Відстежуй свої досягнення">
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex gap-3">
          <div className="rounded-md bg-surface-action p-3">
            <FireEmoji />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm">Стрічка досягнень:</div>
            <div className="text-xl/6">3 дні підряд!</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CustomCard
            className="max-w-full"
            variant="link"
            href="/"
            title="Аналітика настрою"
            icon={<ArrowRightIcon />}
          />
          <CustomCard
            className="max-w-full"
            variant="link"
            href="/"
            title="Персональні поради"
            icon={<ArrowRightIcon />}
          />
        </div>
      </div>
    </SectionCard>
  )
}
