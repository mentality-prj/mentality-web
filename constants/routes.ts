import { transformToRoutes } from '@/helpers/gloabal'
import { MenuItemType, RoutesType } from '@/types/routes'

import { RoutesTitles } from './texts'

export const Routes: RoutesType = Object.freeze({
  ...transformToRoutes(RoutesTitles),
  MAIN: '/',
})

export const menu: Readonly<MenuItemType[]> = [
  { key: 'AFFIRMATIONS', link: Routes.AFFIRMATIONS },
  { key: 'ARTICLES', link: Routes.ARTICLES },
  { key: 'TIPS', link: Routes.TIPS },
]
