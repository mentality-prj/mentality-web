import { transformToRoutes } from '@/helpers/gloabal'
import { MenuItemType, RoutesType } from '@/types/routes'

export const RoutesTitles = Object.freeze({
  ADMIN: 'Admin',
  AFFIRMATIONS: 'Affirmations',
  AIASSISTANT: 'AI-Assistant',
  ARTICLES: 'Articles',
  DELIVERYDETAILS: 'Shop/Delivery-Details',
  GUIDE: 'Guide',
  HOME: 'Home',
  MOODTRACKER: 'Mood-Tracker',
  MYNOTES: 'My-Notes',
  MYPROGRESS: 'My-Progress',
  PAYMENTINFO: 'Shop/Payment-Info',
  PROFILE: 'Profile',
  REMINDER: 'Reminder',
  REVIEW: 'Shop/Review',
  SETTINGS: 'Settings',
  SHOP: 'Shop',
  SIGNIN: 'Signin',
  SUPPORT: 'Support',
  TIPS: 'Tips',
  THANKS: 'Thanks',
})

export const Routes: RoutesType = Object.freeze({
  ...transformToRoutes(RoutesTitles),
  MAIN: '/',
})

export const upLineMenu: Readonly<MenuItemType[]> = [
  { key: 'HOME', link: Routes.HOME },
  { key: 'MOODTRACKER', link: Routes.MOODTRACKER },
  { key: 'GUIDE', link: Routes.GUIDE },
  { key: 'MYNOTES', link: Routes.MYNOTES },
  { key: 'MYPROGRESS', link: Routes.MYPROGRESS },
]

export const underLineMenu: Readonly<MenuItemType[]> = [{ key: 'SETTINGS', link: Routes.SETTINGS }]
