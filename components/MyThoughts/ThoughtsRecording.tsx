'use client'

import { useState } from 'react'
import { Mic } from 'lucide-react'

import TextareaWithLabel from '@/ds/components/TextareaWithLabel'
import { Button } from '@/ds/shadcn/button'
import { cn } from '@/lib/utils'

import { TagsEditor } from '../MoodTracker/AddTagsContainer'
import { SectionCard } from '../ui/SectionCard'

export const ThoughtsRecording = ({ className }: { className?: string }) => {
  const [tags, setTags] = useState<string[]>(['Спорт', 'Вітаміни'])
  return (
    <SectionCard className={cn('w-full', className)} title="Запис думок">
      <div className="mt-4 flex flex-col gap-6">
        <TextareaWithLabel
          placeholder="Введіть запис..."
          rightIcon={<Mic className="h-6 w-6 text-iconcolor-secondary" />}
        />
        <TagsEditor tags={tags} onChange={setTags} />
        <div className="flex flex-col gap-6 tablet:flex-row">
          <Button disabled className="w-full" variant="secondary">
            Скасувати
          </Button>
          <Button disabled className="w-full">
            Зберегти
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
