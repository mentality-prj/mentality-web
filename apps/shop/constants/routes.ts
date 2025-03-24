import { transformToRoutes } from '@/helpers/gloabal'
import { MenuItemType, RoutesType } from '@/types/routes'

export const RoutesTitles = Object.freeze({
  ADMIN: 'Admin',
  AFFIRMATIONS: 'Affirmations',
  ARTICLES: 'Articles',
  CART: 'Cart',
  PROFILE: 'Profile',
  SIGNIN: 'Signin',
  SHOP: '/',
  TIPS: 'Tips',
})

export const Routes: RoutesType = Object.freeze({
  ...transformToRoutes(RoutesTitles),
  MAIN: '/',
})

export const menu: Readonly<MenuItemType[]> = [
  { key: 'AFFIRMATIONS', link: Routes.AFFIRMATIONS },
  { key: 'ARTICLES', link: Routes.ARTICLES },
  { key: 'TIPS', link: Routes.TIPS },
  { key: 'SHOP', link: Routes.SHOP },
  { key: 'CART', link: Routes.CART },
]
