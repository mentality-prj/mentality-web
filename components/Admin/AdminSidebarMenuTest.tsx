'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { adminMenu, AdminMenuType, AdminRoutesTitles } from '@/constants/admin'

import { SUPPORTED_LANGUAGES } from '../../types/languages'

import { getMenuIcon, getMenuItemClass } from './sideMenu.helpers'

// Left sidebar menu for admin panel
export function AdminSidebarMenu() {
  const pathname = usePathname()
  const t = useTranslations('components.Admin')
  const locale = pathname.split('/')[1] || SUPPORTED_LANGUAGES.UKRAINIAN

  return (
    <nav className="inline-block w-64 overflow-hidden rounded-2xl border border-[var(--outline-tertiary)] bg-white text-textcolor-primary">
      <ul className="flex flex-col">
        {adminMenu.map((item: AdminMenuType) => {
          const isActive = pathname.endsWith(`/admin/${item.toLowerCase()}`)
          return (
            <li key={item}>
              <Link href={`/${locale}/admin/${item.toLowerCase()}`} className={getMenuItemClass(isActive)}>
                <span className="flex items-center">
                  {getMenuIcon(item)}
                  {t(AdminRoutesTitles[item as AdminMenuType])}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
