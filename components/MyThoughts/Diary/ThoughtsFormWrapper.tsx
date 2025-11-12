'use client'
import { useState } from 'react'

import { createDiaryNote } from '@/actions/diary.action'

import { ThoughtsForm } from './ThoughtsForm'

export function ThoughtsFormWrapper() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>(['Звичайний запис', 'Вітаміни'])

  const handleSave = async () => {
    if (!content.trim()) return
    setLoading(true)
    try {
      await createDiaryNote({ content, tags })
    } catch (err) {
      console.log('Error of saving', err)
    } finally {
      setLoading(false)
      setContent('')
    }
  }

  return (
    <ThoughtsForm
      onTextChange={setContent}
      onSave={handleSave}
      content={content}
      loading={loading}
      tags={tags}
      setTags={setTags}
    />
  )
}
