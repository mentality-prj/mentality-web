import { ReactNode } from 'react'

import { getServerSession } from '@/lib/get-server-session'
import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import type { UserTag } from '@/types/tags'

import MoodSummaryCardClient from './MoodSummaryCardClient'

interface MoodSummaryCardProps {
  title?: ReactNode
  subtitle?: ReactNode
  counts?: { mood: string; count: number }[]
}

export const MoodSummaryCard = async ({ title = '', subtitle, counts = [] }: MoodSummaryCardProps) => {
  const session = await getServerSession()
  const res = await fetchNormalizedUserTags(session)

  const tags: UserTag[] = !('error' in res) && Array.isArray(res.data) ? res.data : []

  return <MoodSummaryCardClient title={title} subtitle={subtitle} counts={counts} availableTags={tags} />
}
