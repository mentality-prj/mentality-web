'use server'

import { getServerSession } from '@/lib/get-server-session'
import { regenerateMoodStory } from '@/requests/moodStory'

export async function regenerateMoodStoryAction(): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession()
  const result = await regenerateMoodStory(session)

  if ('error' in result) {
    return { success: false, error: result.error }
  }

  return { success: true }
}
