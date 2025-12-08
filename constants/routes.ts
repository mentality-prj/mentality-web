import { transformToRoutes } from '@/helpers/gloabal'
import { RoutesType, UnderLineMenuType, UpLineMenuType } from '@/types/routes'

export const RoutesTitles = Object.freeze({
  ADMIN: 'Admin',
  AFFIRMATIONS: 'Affirmations',
  ARTICLES: 'Articles',
  GUIDE: 'Guide',
  HOME: 'Home',
  MOODTRACKER: 'Mood-Tracker',
  MYNOTES: 'My-Notes',
  MYPROGRESS: 'My-Progress',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  SIGNIN: 'Signin',
  TIPS: 'Tips',
  SERVERERROR: 'Server-Error',
})

export const Routes: RoutesType = Object.freeze({
  ...transformToRoutes(RoutesTitles),
  MAIN: '/',
})

export const upLineMenu: Readonly<UpLineMenuType[]> = [
  { key: 'HOME', link: Routes.HOME },
  { key: 'MOODTRACKER', link: Routes.MOODTRACKER },
  { key: 'GUIDE', link: Routes.GUIDE },
  { key: 'MYNOTES', link: Routes.MYNOTES },
  { key: 'MYPROGRESS', link: Routes.MYPROGRESS },
]

export const underLineMenu: Readonly<UnderLineMenuType[]> = [{ key: 'SETTINGS', link: Routes.SETTINGS }]
