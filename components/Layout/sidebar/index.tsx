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

import { SidebarItem, SidebarItemButton } from './sidebar-item'

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
    <aside className="row-span-full w-full bg-white px-6 pt-4">
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
          <SidebarItemButton className="w-full" onClick={handleSignOut}>
            <LogoutIcon />
            Log out
          </SidebarItemButton>
        </li>
      </ul>
    </aside>
  )
}
