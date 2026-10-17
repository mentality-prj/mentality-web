import { ReactNode } from 'react'

import MoodSummaryCardClient from '@/components/features/MoodTracker/MoodSummaryCard/MoodSummaryCardClient'
import { getServerSession } from '@/lib/get-server-session'
import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import { getUserTimeZone } from '@/lib/userTimeZone'
import type { UserTag } from '@/types/tags'

interface MoodSummaryCardProps {
  title?: ReactNode
  subtitle?: ReactNode
  counts?: { mood: string; count: number }[]
  initialLastSubmittedAt?: string | null
  historyVerified?: boolean
}

export const MoodSummaryCard = async ({
  title = '',
  subtitle,
  counts = [],
  initialLastSubmittedAt,
  historyVerified = true,
}: MoodSummaryCardProps) => {
  const session = await getServerSession()
  const timeZone = await getUserTimeZone()
  const res = await fetchNormalizedUserTags(session)

  const tags: UserTag[] = !('error' in res) && Array.isArray(res.data) ? res.data : []

  const cardProps = { title, subtitle, counts, availableTags: tags, timeZone, initialLastSubmittedAt, historyVerified }
  return <MoodSummaryCardClient {...cardProps} />
}
