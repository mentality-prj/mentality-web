import { ACTION_ROUTES, ACTION_TYPE_ROUTES, EXERCISE_CATEGORY_ROUTES } from '@/constants/moodStory'
import { MoodStoryAction } from '@/types/api-responses'

export function resolveActionRoute(action: MoodStoryAction): string | null {
  if (action.type === 'exercise' && action.category) {
    const categoryRoute = EXERCISE_CATEGORY_ROUTES[action.category]
    if (categoryRoute) return categoryRoute
  }

  return ACTION_TYPE_ROUTES[action.type] ?? null
}

/** @deprecated Use resolveActionRoute with MoodStoryAction instead */
export function resolveActionRouteFromString(action: string): string | null {
  for (const [pattern, route] of ACTION_ROUTES) {
    if (pattern.test(action)) return route
  }
  return null
}
