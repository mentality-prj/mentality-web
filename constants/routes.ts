import { transformToRoutes } from '@/helpers/gloabal'
import { MenuItemType, RoutesType } from '@/types/routes'

export const RoutesTitles = Object.freeze({
  ADMIN: 'Admin',
  AFFIRMATIONS: 'Affirmations',
  AIASSISTANT: 'AI-Assistant',
  ARTICLES: 'Articles',
  DELIVERYDETAILS: 'Shop/Delivery-Details',
  HOME: 'Home',
  CART: 'Shop/Cart',
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

export const menu: Readonly<MenuItemType[]> = [
  { key: 'AFFIRMATIONS', link: Routes.AFFIRMATIONS },
  { key: 'ARTICLES', link: Routes.ARTICLES },
  { key: 'TIPS', link: Routes.TIPS },
  { key: 'SHOP', link: Routes.SHOP },
  { key: 'CART', link: Routes.CART },
]
