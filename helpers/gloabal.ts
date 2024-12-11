import { RoutesTitles } from '@/constants/routes'

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

export function transformToRoutes(titles: typeof RoutesTitles): Record<keyof typeof RoutesTitles, string> {
  return Object.fromEntries(Object.entries(titles).map(([key]) => [key, `/${key.toLowerCase()}`])) as Record<
    keyof typeof RoutesTitles,
    string
  >
}
