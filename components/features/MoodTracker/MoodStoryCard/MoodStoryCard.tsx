import { getTranslations } from 'next-intl/server'

import Card from '@/components/shared/Cards/Card'
import { getServerSession } from '@/lib/get-server-session'
import { getLatestMoodStory } from '@/requests/moodStory'
import { MoodStoryResult } from '@/types/api-responses'

import { MoodStoryAdminBar } from './MoodStoryAdminBar'
import { MoodStoryNavigator } from './MoodStoryNavigator'
import { StoryError } from './StoryError'
import { StoryNotReady } from './StoryNotReady'

interface MoodStoryCardProps {
  isAdmin?: boolean
  initialStory?: MoodStoryResult
}

export async function MoodStoryCard({ isAdmin, initialStory }: MoodStoryCardProps = {}) {
  const t = await getTranslations('components.MoodStoryCard.card')
  const adminTools = isAdmin ? <MoodStoryAdminBar /> : undefined

  let result: MoodStoryResult
  if (initialStory) {
    result = initialStory
  } else {
    const session = await getServerSession()
    result = await getLatestMoodStory(session)
  }

  if ('error' in result) {
    const isNotReady = result.status === 404
    return (
      <Card title={t('title')} tools={adminTools}>
        {isNotReady ? <StoryNotReady /> : <StoryError />}
      </Card>
    )
  }

  const { screens } = result.data
  if (screens.length === 0) {
    return (
      <Card title={t('title')} tools={adminTools}>
        <StoryNotReady />
      </Card>
    )
  }

  return <MoodStoryNavigator screens={screens} isAdmin={isAdmin} />
}
