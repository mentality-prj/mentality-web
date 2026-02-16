'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CustomInput } from '@/ds/components/CustomInput'
import { Badge } from '@/ds/shadcn/badge'
import { Button } from '@/ds/shadcn/button'

type AddTagsProps = {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function AddTags({ tags, onChange }: AddTagsProps) {
  const t = useTranslations('components.Mood')

  const [input, setInput] = useState('')

  const addTag = () => {
    const newTag = input.trim()
    if (newTag && !tags.includes(newTag)) {
      const updated = [...tags, newTag]
      onChange(updated)
    }
    setInput('')
  }

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove)
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-col gap-xs tablet:flex-row">
        <div className="w-full">
          <CustomInput
            id="add-tag-input"
            placeholder={t('placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
          />
        </div>
        <Button onClick={addTag}>{t('add')}</Button>
      </div>

      <div className="flex flex-wrap gap-xs">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="flex items-center gap-1 pr-1">
            {tag}
            <X className="h-4 w-4 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
          </Badge>
        ))}
      </div>
    </div>
  )
}
