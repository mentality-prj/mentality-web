'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import { CustomInput } from '@/ds/components/CustomInput'
import { Badge } from '@/ds/shadcn/badge'
import { Button } from '@/ds/shadcn/button'

type AddTagsProps = {
  initialTags: string[]
  onChange: (tags: string[]) => void
}

export default function AddTags({ initialTags, onChange }: AddTagsProps) {
  const [input, setInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialTags)

  const addTag = () => {
    const newTag = input.trim()
    if (newTag && !tags.includes(newTag)) {
      const updated = [...tags, newTag]
      setTags(updated)
      onChange(updated)
    }
    setInput('')
  }

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove)
    setTags(updated)
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 tablet:flex-row">
        <div className="w-full">
          <CustomInput
            placeholder="Новий тег"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
          />
        </div>
        <Button onClick={addTag}>Додати</Button>
      </div>

      <div className="flex flex-wrap gap-2">
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
