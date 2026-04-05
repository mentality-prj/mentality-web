'use server'

import { auth } from '@/auth'
import { regenerateMoodStory } from '@/requests/moodStory'

export async function regenerateMoodStoryAction(): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  const result = await regenerateMoodStory(session)

  if ('error' in result) {
    return { success: false, error: result.error }
  }

  return { success: true }
}
