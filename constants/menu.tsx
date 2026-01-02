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
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'faq', href: '/faq' },
  { key: 'contacts', href: '/contacts' },
  { key: 'myday', href: '/myday', icon: 'bookHeart' },
]

export const adminTopMenu: AdminTopMenuType = [
  { key: 'myday', href: '/myday', icon: 'bookHeart' },
  { key: 'admin', href: '/admin', icon: 'layoutDashboard' },
]

export const userTopMenu: UserTopMenuType = [
  { key: 'myday', href: '/myday', icon: 'bookHeart' },
  { key: 'faq', href: '/faq' },
  { key: 'contacts', href: '/contacts' },
]

export type SidebarMenuType = 'admin' | 'user'
export type SidebarMenuItemType = {
  key: string
  href: string
  icon?: string
}

export const adminSidebarMenu: SidebarMenuItemType[] = [
  {
    key: 'tabs.tags',
    href: '/admin/tags',
    icon: 'tag',
  },
  { key: 'tabs.tips', href: '/admin/tips', icon: 'lightbulb' },
  { key: 'tabs.exercises', href: '/admin/exercises', icon: 'brain' },
]

export const userSidebarMenu: SidebarMenuItemType[] = [
  {
    key: 'mood-tracker',
    href: '/mood-tracker',
    icon: 'activity',
  },
  { key: 'guide', href: '/guide', icon: 'bookOpenCheck' },
  { key: 'my-notes', href: '/my-notes', icon: 'notebookPen' },
  { key: 'my-progress', href: '/my-progress', icon: 'chartNoAxesCombined' },
]
