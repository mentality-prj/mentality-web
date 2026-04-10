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
    if (action.category === 'breathing') return `${Routes.GUIDE}/breathing`
    if (action.category === 'calming') return `${Routes.GUIDE}/calming`
    return Routes.meditationDetail(action.exerciseId)
  }

  return routeForActionType(action.type)
}
