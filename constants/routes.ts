import { MenuItemType } from '@/types/routes'

export const Routes = Object.freeze({
  MAIN: '/',
  SIGNIN: '/signin',
  PROFILE: '/profile',
  ADMIN: '/admin',
  DASHBOARD: '/dashboard',
})

export const menu: Readonly<MenuItemType[]> = [
  { key: 'MAIN', link: Routes.MAIN },
  { key: 'PROFILE', link: Routes.PROFILE },
  { key: 'ADMIN', link: Routes.ADMIN },
  { key: 'DASHBOARD', link: Routes.DASHBOARD },
]
