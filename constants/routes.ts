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
  MEDITATIONS: 'Guide/Meditations',
  GUIDETIPS: 'Guide/Tips',
  MYDAY: 'My-day',
  MOODTRACKER: 'Mood-Tracker',
  MYSPACE: 'My-Space',
  MYPROGRESS: 'My-Progress',
  MYPROGRESSGOALS: 'My-Progress/Goals',
  MYPROGRESSSTATISTICS: 'My-Progress/Statistics',
  MENTAL_GAMES: 'Mental-Games',
  PSYCHOLOGICALTESTS: 'Psychological-Tests',
  MENTAL_CHECK: 'Psychological-Tests/mental-check',
  ANXIETY_CHECK: 'Psychological-Tests/anxiety-check',
  WELL_BEING_CHECK: 'Psychological-Tests/well-being-check',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  SIGNIN: 'Signin',
  TIPS: 'Tips',
  ATTENTION_SPRINT: 'Mental-Games/Attention-Sprint',
  SERVERERROR: 'Server-Error',
  PRIVACY: 'Privacy',
  TERMS: 'Terms',
  COOKIES: 'Cookies',
  COMPANY: 'Company',
  COMPANY_GLOBAL_ADMIN: 'Admin/Company',
  COMPANY_ADMIN: 'Company/Admin',
  COMPANY_ADMIN_EMPLOYEES: 'Company/Admin/Employees',
  COMPANY_ADMIN_GROUPS: 'Company/Admin/Groups',
  COMPANY_MANAGER: 'Company/Manager',
  COMPANY_MANAGER_INVITES: 'Company/Manager/Invites',
  COMPANY_MANAGER_ANALYTICS: 'Company/Manager/Analytics',
})

export const Routes = Object.freeze({
  ...transformToRoutes(RoutesTitles),
  MAIN: '/',
  meditationDetail: (id: string) => `/guide/meditations/${id}`,
  adminCompanyDetail: (id: string) => `/admin/company/${id}`,
  adminCompanyGroups: (id: string) => `/admin/company/${id}/groups`,
  adminCompanyEmployees: (id: string) => `/admin/company/${id}/employees`,
  adminCompanyInvites: (id: string) => `/admin/company/${id}/invites`,
}) as RoutesType & {
  readonly meditationDetail: (id: string) => string
  readonly adminCompanyDetail: (id: string) => string
  readonly adminCompanyGroups: (id: string) => string
  readonly adminCompanyEmployees: (id: string) => string
  readonly adminCompanyInvites: (id: string) => string
}
