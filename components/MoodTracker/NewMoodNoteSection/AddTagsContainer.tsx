'use client'

import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ds/shadcn/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/ds/shadcn/toggle-group'

import AddTags from './AddTags'

type TagsEditorProps = {
  tags: string[]
  onChange: (tags: string[]) => void
}

export const TagsEditor = ({ tags, onChange }: TagsEditorProps) => {
  const t = useTranslations('components.Mood')

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center justify-between">
        <div>{t('addTags')}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="max-h-6 text-sm" variant="textButton" size="base">
              <Pencil className="mr-1 h-4 w-4" />
              {t('changeTags')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('changeTags')}</DialogTitle>
            </DialogHeader>
            <AddTags tags={tags} onChange={onChange} />
          </DialogContent>
        </Dialog>
      </div>

      <ToggleGroup className="flex-wrap justify-start gap-xs" type="multiple">
        {tags.map((tag) => (
          <ToggleGroupItem
            value={tag}
            aria-label={`Toggle ${tag}`}
            key={tag}
            className="data-[state='on']:text-reversed max-h-[22px] rounded-xs bg-secondary px-3 py-1 text-xs text-textcolor-secondary data-[state='on']:bg-primary"
          >
            {tag}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
