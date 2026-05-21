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

export const companyAdminSidebarMenu: SidebarMenuItemType[] = [
  { key: 'company-employees', href: Routes.COMPANY_ADMIN_EMPLOYEES, icon: 'users' },
  { key: 'company-invites', href: Routes.COMPANY_ADMIN_INVITES, icon: 'mailPlus' },
  { key: 'company-access-scopes', href: Routes.COMPANY_ADMIN_ACCESS_SCOPES, icon: 'shield' },
  { key: 'company-groups', href: Routes.COMPANY_ADMIN_GROUPS, icon: 'folderTree' },
]

export const companyManagerSidebarMenu: SidebarMenuItemType[] = [
  { key: 'company-employees', href: Routes.COMPANY_MANAGER_EMPLOYEES, icon: 'users' },
  { key: 'company-analytics', href: Routes.COMPANY_MANAGER_ANALYTICS, icon: 'chartNoAxesCombined' },
  { key: 'company-decision-support', href: Routes.COMPANY_MANAGER_DECISION_SUPPORT, icon: 'clipboardList' },
  { key: 'company-invites', href: Routes.COMPANY_MANAGER_INVITES, icon: 'mailPlus' },
]

const researchSidebarMenuItems: SidebarMenuItemType[] = [
  { key: 'research-projects', href: Routes.RESEARCH_PROJECTS, icon: 'folderTree' },
  { key: 'research-create-project', href: Routes.RESEARCH_PROJECTS_CREATE, icon: 'notebookPen' },
]

export function getResearchSidebarMenu(options?: { includeCreate?: boolean }): SidebarMenuItemType[] {
  const includeCreate = options?.includeCreate ?? false

  return includeCreate
    ? researchSidebarMenuItems
    : researchSidebarMenuItems.filter((item) => item.key !== 'research-create-project')
}

export const userSidebarMenu: SidebarMenuItemType[] = [
  // { key: 'affirmations', href: Routes.AFFIRMATIONS, icon: 'flower' }, TODO: temporarily hide #348
  { key: 'my-space', href: Routes.MYSPACE, icon: 'bookmark' },
  {
    key: 'mood-tracker',
    href: Routes.MOODTRACKER,
    icon: 'activity',
  },
  // { key: 'guide', href: Routes.GUIDE, icon: 'bookOpenCheck' }, TODO: temporarily hide #348
  { key: 'diary', href: Routes.DIARY, icon: 'notebookPen' },
  { key: 'my-progress', href: Routes.MYPROGRESS, icon: 'chartNoAxesCombined' },
  { key: 'psychological-tests', href: Routes.PSYCHOLOGICALTESTS, icon: 'test' },
  { key: 'mental-games', href: Routes.MENTAL_GAMES, icon: 'puzzle' },
]

export function getUserSidebarMenu(): SidebarMenuItemType[] {
  return userSidebarMenu
}

export const guideMenu = [
  { key: 'tips', href: `${Routes.GUIDE}/tips`, icon: 'lightbulb' },
  { key: 'meditations', href: `${Routes.GUIDE}/meditations`, icon: 'waves' },
  { key: 'breathing', href: `${Routes.GUIDE}/breathing`, icon: 'wind' },
  { key: 'calming', href: `${Routes.GUIDE}/calming`, icon: 'heartHandshake' },
]

export type PsychologicalTestsInnerMenuItemKey = 'well-being-check' | 'mental-check' | 'anxiety-check'
export type PsychologicalTestsInnerMenuItem = {
  key: PsychologicalTestsInnerMenuItemKey
  href: string
  icon: string
}

export const psychologicalTestsInnerMenuItems: PsychologicalTestsInnerMenuItem[] = [
  { key: 'well-being-check', href: `${Routes.PSYCHOLOGICALTESTS}/well-being-check`, icon: 'badgeCheck' },
  { key: 'mental-check', href: `${Routes.PSYCHOLOGICALTESTS}/mental-check`, icon: 'brainCircuit' },
  { key: 'anxiety-check', href: `${Routes.PSYCHOLOGICALTESTS}/anxiety-check`, icon: 'activity' },
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

export type MentalGamesInnerMenuItemKey = 'attentionSprint'
export type MentalGamesInnerMenuItem = {
  key: MentalGamesInnerMenuItemKey
  href: string
  icon: string
}

export const mentalGamesInnerMenuItems: MentalGamesInnerMenuItem[] = [
  { key: 'attentionSprint', href: Routes.ATTENTION_SPRINT, icon: 'brainCircuit' },
]

export type AdminInnerMenuItemKey = 'dashboard' | 'ds' | 'goals' | 'achievements' | 'phq9'
export type AdminInnerMenuItem = {
  key: AdminInnerMenuItemKey
  href: string
  icon: string
}

export const adminInnerMenuItems: AdminInnerMenuItem[] = [
  { key: 'dashboard', href: `${Routes.ADMIN}/dashboard`, icon: 'layoutDashboard' },
  { key: 'ds', href: `${Routes.ADMIN}/ds`, icon: 'brain' },
  { key: 'goals', href: `${Routes.ADMIN}/goals`, icon: 'goal' },
  { key: 'achievements', href: `${Routes.ADMIN}/achievements`, icon: 'trophy' },
  { key: 'phq9', href: `${Routes.ADMIN}/phq9`, icon: 'brainCircuit' },
]
