import { Routes } from '@/constants/routes'
import { MoodStoryAction, MoodStoryActionType } from '@/types/api-responses'

function routeForActionType(type: MoodStoryActionType): string | null {
  switch (type) {
    case 'exercise':
      return Routes.GUIDE
    case 'sleep':
      return Routes.GUIDE
    case 'checkin':
      return Routes.MOODTRACKER
    default:
      return null
  }
}

export function resolveActionRoute(action: MoodStoryAction): string | null {
  if (action.type === 'exercise') {
    switch (action.category) {
      case 'breathing':
        return Routes.GUIDE
      case 'meditation':
        return Routes.MEDITATIONS
      case 'calming':
        return Routes.GUIDE
    }
  }

  return routeForActionType(action.type)
}
