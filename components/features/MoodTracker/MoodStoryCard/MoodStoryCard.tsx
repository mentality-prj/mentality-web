import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import Card from '@/components/shared/Cards/Card'
import { getLatestMoodStory } from '@/requests/moodStory'

import { MoodStoryAdminBar } from './MoodStoryAdminBar'
import { MoodStoryNavigator } from './MoodStoryNavigator'
import { StoryError } from './StoryError'
import { StoryNotReady } from './StoryNotReady'

export async function MoodStoryCard({ isAdmin }: { isAdmin?: boolean } = {}) {
  const session = await auth()
  const t = await getTranslations('components.MoodStoryCard.card')
  const adminTools = isAdmin ? <MoodStoryAdminBar /> : undefined

  const result = await getLatestMoodStory(session)

  if ('error' in result) {
    const isNotReady = result.status === 404
    return (
      <Card title={t('title')} tools={adminTools}>
        {isNotReady ? <StoryNotReady /> : <StoryError />}
      </Card>
    )
  }

  const screens = result.data.screens
  if (screens.length === 0) {
    return (
      <Card title={t('title')} tools={adminTools}>
        <StoryNotReady />
      </Card>
    )
  }

  return <MoodStoryNavigator screens={screens} isAdmin={isAdmin} />
}
