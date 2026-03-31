'use client'

import { useState } from 'react'
import { ChevronDown, Menu as LucideMenu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Logo from '@/components/Layout/Header/Logo'
import SidebarMenu from '@/components/Layout/Sidebar/SidebarMenu'
import { userSidebarMenu, userTopMenu } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

export default function MobileNavDrawer() {
  const [open, setOpen] = useState(false)
  const [topOpen, setTopOpen] = useState(false)
  const t = useTranslations('components.Navbar')
  const pathname = usePathname()

  return (
    <>
      {/* Burger trigger */}
      <button
        type="button"
        aria-label={t('openNavigation')}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center text-textcolor-secondary desktop:hidden"
      >
        <LucideMenu size={22} />
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 desktop:hidden" aria-hidden onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden bg-white shadow-xl transition-transform duration-300 ease-in-out desktop:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-4 py-4">
          <Logo />
          <button
            type="button"
            aria-label={t('closeNavigation')}
            onClick={() => setOpen(false)}
            className="text-textcolor-secondary"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable area: main nav + quick links */}
        <div className="min-h-0 w-full flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            <SidebarMenu menu={userSidebarMenu} onLinkClick={() => setOpen(false)} />
          </div>

          {/* Top menu collapsed section */}
          <div className="m-4 rounded border border-border px-4 py-3">
            <button
              type="button"
              onClick={() => setTopOpen((v) => !v)}
              className="flex w-full items-center justify-between text-xs tracking-wide text-textcolor-secondary"
            >
              <span>{t('quickLinks')}</span>
              <ChevronDown size={16} className={`transition-transform ${topOpen ? 'rotate-180' : ''}`} />
            </button>

            {topOpen && (
              <ul className="mt-2 flex flex-col gap-1 pb-4">
                {userTopMenu.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded px-2 py-2 text-sm transition-colors hover:bg-background-muted ${
                          isActive ? 'font-semibold text-primary' : 'text-textcolor-secondary'
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
