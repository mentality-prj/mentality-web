import { Routes } from '@/constants/routes'

export type RouteKeyType = keyof typeof Routes
export type RouteLinkType = (typeof Routes)[RouteKeyType]
export type RouteTitleType = {
  [key in RouteKeyType]: string
}

export type MenuItemType = {
  key: RouteKeyType
  link: RouteLinkType
}
