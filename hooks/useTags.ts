'use client'
import { useEffect, useState } from 'react'

import { UserTag } from '../types/tags'

type Params = {
  availableTags?: UserTag[]
}

export default function useTags({ availableTags = [] }: Params) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [localAvailableTags, setLocalAvailableTags] = useState<UserTag[]>(availableTags)
  const [tagLabels, setTagLabels] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    availableTags.forEach((t) => {
      if (t && t.key && t.name) map[t.key] = t.name
    })
    return map
  })
  const [showAddTag, setShowAddTag] = useState(false)

  useEffect(() => {
    setLocalAvailableTags(availableTags)
    setTagLabels(() => {
      const map: Record<string, string> = {}
      availableTags.forEach((t) => {
        if (t && t.key && t.name) map[t.key] = t.name
      })
      return map
    })
  }, [availableTags])

  useEffect(() => {
    setTagLabels((prev) => {
      const next: Record<string, string> = {}
      localAvailableTags.forEach((k) => {
        if (prev[k.key]) next[k.key] = prev[k.key]
      })
      return next
    })
  }, [localAvailableTags])

  const addTag = (t: string) => {
    setSelectedTags((prev) => (prev.includes(t) ? prev : [...prev, t]))
  }

  const removeTag = (t: string) => {
    setSelectedTags((prev) => prev.filter((x) => x !== t))
  }

  const clearSelectedTags = () => {
    setSelectedTags([])
  }

  const onTagCreated = ({ key, name }: { key: string; name: string }) => {
    setLocalAvailableTags((prev) => (prev.some((x) => x.key === key) ? prev : [...prev, { key, name }]))
    setTagLabels((prev) => ({ ...prev, [key]: name }))
    addTag(key)
  }

  return {
    selectedTags,
    setSelectedTags,
    clearSelectedTags,
    localAvailableTags,
    tagLabels,
    showAddTag,
    setShowAddTag,
    addTag,
    removeTag,
    onTagCreated,
  }
}
