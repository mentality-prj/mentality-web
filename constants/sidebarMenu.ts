import { ElementType } from 'react'
import {
  ActivityIcon,
  BookOpenCheckIcon,
  Brain,
  ChartNoAxesCombined,
  Lightbulb,
  NotebookPenIcon,
  Tag,
} from 'lucide-react'

export type SidebarMenuType = 'admin' | 'user'
export type SidebarMenuItemType = { key: string; href: string; icon?: ElementType }

export const adminSidebarMenu: SidebarMenuItemType[] = [
  {
    key: 'tabs.tags',
    href: '/admin/tags',
    icon: Tag,
  },
  { key: 'tabs.tips', href: '/admin/tips', icon: Lightbulb },
  { key: 'tabs.exercises', href: '/admin/exercises', icon: Brain },
] as const

export const userSidebarMenu: SidebarMenuItemType[] = [
  {
    key: 'mood-tracker',
    href: '/mood-tracker',
    icon: ActivityIcon,
  },
  { key: 'guide', href: '/guide', icon: BookOpenCheckIcon },
  { key: 'my-notes', href: '/my-notes', icon: NotebookPenIcon },
  { key: 'my-progress', href: '/my-progress', icon: ChartNoAxesCombined },
] as const
