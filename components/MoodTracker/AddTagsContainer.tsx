'use client'

import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ds/shadcn/dialog'

import AddTags from './AddTags'

type TagsEditorProps = {
  tags: string[]
  onChange: (tags: string[]) => void
}

export const TagsEditor = ({ tags, onChange }: TagsEditorProps) => {
  const t = useTranslations('MoodTracker.MoodNote')

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between py-4">
        <div>{t('add tags')}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="textButton" size="base">
              <Pencil className="mr-1 h-4 w-4" /> {t('change tags')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('change tags')}</DialogTitle>
            </DialogHeader>

            <AddTags initialTags={tags} onChange={onChange} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="border-muted bg-muted/30 text-muted-foreground rounded-full border px-2 py-1 text-sm"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}
