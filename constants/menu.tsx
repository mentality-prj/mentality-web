import { BookHeart, LayoutDashboard } from 'lucide-react'

export const landingMenu = [
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'faq', href: '/faq' },
  { key: 'contacts', href: '/contacts' },
  { key: 'myday', href: '/myday', icon: BookHeart },
] as const

export type LandingMenuType = typeof landingMenu

export const adminTopMenu = [
  { key: 'myday', href: '/myday', icon: BookHeart },
  { key: 'admin', href: '/admin', icon: LayoutDashboard },
] as const

export type AdminTopMenuType = typeof adminTopMenu

export const userTopMenu = [
  { key: 'myday', href: '/myday', icon: BookHeart },
  { key: 'faq', href: '/faq' },
  { key: 'contacts', href: '/contacts' },
] as const

export type UserTopMenuType = typeof userTopMenu

export type TopMenuType = LandingMenuType | AdminTopMenuType | UserTopMenuType
