import { Routes, RoutesTitles } from '@/constants/routes'

export type RoutesType = Readonly<Record<keyof typeof RoutesTitles | 'MAIN', string>>
export type RouteKeyType = keyof typeof Routes
type RouteLinkType = (typeof Routes)[RouteKeyType]

type RoutesTitlesKeyType = keyof typeof RoutesTitles

export type MenuItemType = {
  key: RoutesTitlesKeyType
  link: RouteLinkType
}
