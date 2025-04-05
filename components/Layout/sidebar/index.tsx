'use client'
import { signOut } from 'next-auth/react'

import { Routes } from '@/constants/routes'
import {
  ArchiveIcon,
  BagIcon,
  ChartIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
  MoonIcon,
  SettingIcon,
  SupportIcon,
} from '@/ds/icons'
import { Switch } from '@/ds/shadcn/switch'

import { SidebarItem } from './sidebar-item'

const testMenuItems = Array(3).fill({
  icon: <HomeIcon />,
  label: 'Menu name',
  href: '#',
})

const menuItems = [
  {
    icon: <ChartIcon />,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: <BagIcon />,
    label: 'Shop',
    href: '/shop',
  },
  {
    icon: <ArchiveIcon />,
    label: 'Oder History',
    href: '/order-history',
  },
]

const footerItems = [
  {
    icon: <SettingIcon />,
    label: 'Settings',
    href: '/settings',
    isActive: true,
  },
  {
    icon: <SupportIcon />,
    label: 'Support',
    href: '/support',
  },
]

export default function Sidebar() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }
  return (
    <aside className="row-span-full w-full bg-card px-6 pt-4">
      <LogoIcon className="mb-8 pl-4" />
      <nav className="mb-10 flex w-full flex-col">
        <ul className="flex flex-col gap-2 border-b pb-4">
          {testMenuItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
          {menuItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </ul>
        <ul className="flex flex-col gap-2 pt-4">
          {footerItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </ul>
      </nav>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center py-2 pl-4">
          <MoonIcon />
          <span className="ml-2 mr-auto font-medium">Dark mode</span>
          <Switch />
        </li>
        <li>
          <button
            className="flex w-full items-center gap-2 rounded-lg bg-transparent py-2 pl-4 font-medium transition-colors hover:bg-secondary hover:text-primary-hover focus-visible:bg-secondary focus-visible:text-primary-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus active:bg-secondary-pressed active:text-primary-foreground [&_svg_circle]:transition-colors [&_svg_circle]:hover:stroke-primary-hover [&_svg_circle]:focus-visible:stroke-primary-focus [&_svg_circle]:active:stroke-primary-foreground [&_svg_path]:transition-colors [&_svg_path]:hover:stroke-primary-hover [&_svg_path]:focus-visible:stroke-primary-focus [&_svg_path]:active:stroke-primary-foreground"
            onClick={handleSignOut}
          >
            <LogoutIcon />
            Log out
          </button>
        </li>
      </ul>
    </aside>
  )
}
