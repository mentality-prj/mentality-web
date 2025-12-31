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
