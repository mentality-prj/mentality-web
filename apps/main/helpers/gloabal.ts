import { RoutesTitles } from '@/constants/routes'

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

export function transformToRoutes(titles: typeof RoutesTitles): Record<keyof typeof RoutesTitles, string> {
  return Object.fromEntries(Object.entries(titles).map(([key, link]) => [key, `/${link.toLowerCase()}`])) as Record<
    keyof typeof RoutesTitles,
    string
  >
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
