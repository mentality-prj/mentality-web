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
  DIARY: 'Diary',
  GUIDE: 'Guide',
  MYDAY: 'My-day',
  MOODTRACKER: 'Mood-Tracker',
  MYSPACE: 'My-Space',
  MYPROGRESS: 'My-Progress',
  PSYCHOLOGICALTESTS: 'Psychological-Tests',
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
