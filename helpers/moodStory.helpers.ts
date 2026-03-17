import { ACTION_ROUTES } from '@/constants/moodStory'

export function resolveActionRoute(action: string): string | null {
  for (const [pattern, route] of ACTION_ROUTES) {
    if (pattern.test(action)) return route
  }
  return null
}
