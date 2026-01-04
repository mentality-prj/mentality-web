import { transformToRoutes } from '@/helpers/gloabal'
import { RoutesType } from '@/types/routes'

export const RoutesTitles = Object.freeze({
  ADMIN: 'Admin',
  ABOUT: 'About',
  SERVICES: 'Services',
  FAQ: 'Faq',
  CONTACTS: 'Contacts',
  AFFIRMATIONS: 'Affirmations',
  ARTICLES: 'Articles',
  GUIDE: 'Guide',
  MYDAY: 'Myday',
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
