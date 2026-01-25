import { Routes } from '@/constants/routes'

export type TopMenuItem = {
  key: string
  href: string
  icon?: string
}

export type LandingMenuType = TopMenuItem[]
export type AdminTopMenuType = TopMenuItem[]
export type UserTopMenuType = TopMenuItem[]
export type TopMenuType = LandingMenuType | AdminTopMenuType | UserTopMenuType

export const landingMenu: LandingMenuType = [
  { key: 'about', href: Routes.ABOUT },
  { key: 'services', href: Routes.SERVICES },
  { key: 'faq', href: Routes.FAQ },
  { key: 'contacts', href: Routes.CONTACTS },
  { key: 'my-day', href: Routes.MYDAY, icon: 'bookHeart' },
]

export const adminTopMenu: AdminTopMenuType = [
  { key: 'my-day', href: Routes.MYDAY, icon: 'bookHeart' },
  { key: 'admin', href: Routes.ADMIN, icon: 'layoutDashboard' },
]

export const userTopMenu: UserTopMenuType = [
  { key: 'my-day', href: Routes.MYDAY, icon: 'bookHeart' },
  { key: 'faq', href: Routes.FAQ },
  { key: 'contacts', href: Routes.CONTACTS },
]

export type SidebarMenuType = 'admin' | 'user'
export type SidebarMenuItemType = {
  key: string
  href: string
  icon?: string
}

export const adminSidebarMenu: SidebarMenuItemType[] = [
  { key: 'affirmations', href: `${Routes.ADMIN}/affirmations`, icon: 'flower' },
  {
    key: 'tags',
    href: `${Routes.ADMIN}/tags`,
    icon: 'tag',
  },
  { key: 'tips', href: `${Routes.ADMIN}/tips`, icon: 'lightbulb' },
  { key: 'exercises', href: `${Routes.ADMIN}/exercises`, icon: 'brain' },
]

export const userSidebarMenu: SidebarMenuItemType[] = [
  { key: 'affirmations', href: Routes.AFFIRMATIONS, icon: 'flower' },
  {
    key: 'mood-tracker',
    href: Routes.MOODTRACKER,
    icon: 'activity',
  },
  { key: 'guide', href: Routes.GUIDE, icon: 'bookOpenCheck' },
  { key: 'my-notes', href: Routes.MYNOTES, icon: 'notebookPen' },
  { key: 'my-progress', href: Routes.MYPROGRESS, icon: 'chartNoAxesCombined' },
]

export const guideMenu = [
  { key: 'tips', href: `${Routes.GUIDE}/tips`, icon: 'lightbulb' },
  { key: 'meditations', href: `${Routes.GUIDE}/meditations`, icon: 'waves' },
  { key: 'breathing', href: `${Routes.GUIDE}/breathing`, icon: 'wind' },
  { key: 'calming', href: `${Routes.GUIDE}/calming`, icon: 'heartHandshake' },
]

export type MyProgressInnerMenuItem = {
  key: 'achievements' | 'goals' | 'statistics'
  href: string
  icon: string
}

export const myProgressInnerMenuItems: MyProgressInnerMenuItem[] = [
  { key: 'achievements', href: `${Routes.MYPROGRESS}/achievements`, icon: 'trophy' },
  { key: 'goals', href: `${Routes.MYPROGRESS}/goals`, icon: 'goal' },
  { key: 'statistics', href: `${Routes.MYPROGRESS}/statistics`, icon: 'chart' },
]
