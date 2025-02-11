import { transformToRoutes } from '@/helpers/gloabal'
import { MenuItemType, RoutesType } from '@/types/routes'

export const RoutesTitles = Object.freeze({
  ADMIN: 'Admin',
  AFFIRMATIONS: 'Affirmations',
  ARTICLES: 'Articles',
  'SHOP/CART': 'Cart',
  PROFILE: 'Profile',
  SIGNIN: 'Signin',
  SHOP: 'Shop',
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
  { key: 'SHOP/CART', link: Routes['SHOP/CART'] },
]
