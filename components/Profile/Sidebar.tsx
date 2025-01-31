'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

import { Routes } from '@/constants/routes'

import { HomeIcon, LogoutIcon, SettingIcon, SupportIcon } from '../ui/icons/profile'

const menuItems = Array(6).fill({
  icon: <HomeIcon />,
  label: 'Menu name',
  href: '#',
})
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
interface ItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}
export default function ProfileSidebar() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }
  return (
    <aside className="flex w-full max-w-[263px] flex-col items-center border-r bg-content1 px-8">
      <h1 className="mb-12 mt-8 w-full pl-4 text-3xl font-black text-purple-700">SoulSpace</h1>
      <nav className="flex w-full flex-col gap-24">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <Item key={index} {...item} />
          ))}
        </ul>
        <ul className="flex flex-col gap-2">
          {footerItems.map((item, index) => (
            <Item key={index} {...item} />
          ))}
          <li>
            <button
              className="flex w-full items-center gap-1 rounded-lg px-4 py-1 text-sm font-medium transition-colors hover:bg-[#EAECEE]"
              onClick={handleSignOut}
            >
              <LogoutIcon />
              Log out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

const Item = ({ href, icon, label, isActive }: ItemProps) => (
  <li>
    <Link
      href={href}
      className={clsx(
        isActive
          ? 'bg-[#F8F1FE] text-purple-700 [&_svg_circle]:stroke-purple-700 [&_svg_path]:stroke-purple-700'
          : 'hover:bg-[#EAECEE]',
        'flex items-center gap-1 rounded-lg px-4 py-1 text-sm font-medium transition-colors'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
)
