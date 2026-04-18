import { ReactNode } from 'react'

import { getServerSession } from '@/lib/get-server-session'
import { fetchUserTagsCached } from '@/lib/userTagsCache'
import type { UserTag } from '@/types/tags'

import MoodSummaryCardClient from './MoodSummaryCardClient'

interface MoodSummaryCardProps {
  title?: ReactNode
  subtitle?: ReactNode
  counts?: { mood: string; count: number }[]
}

export const MoodSummaryCard = async ({ title = '', subtitle, counts = [] }: MoodSummaryCardProps) => {
  const session = await getServerSession()
  const res = await fetchUserTagsCached(session)

  let tags: UserTag[] = []
  if (!('error' in res) && Array.isArray(res.data)) {
    tags = (res.data as Array<Partial<UserTag>>)
      .filter((t) => !!t?.key)
      .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))
  }

  return <MoodSummaryCardClient title={title} subtitle={subtitle} counts={counts} availableTags={tags} />
}
