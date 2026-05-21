'use client'

import { useState } from 'react'
import { ChevronDown, PanelRight, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import SidebarMenu from '@/components/Layout/Sidebar/SidebarMenu'
import { adminSidebarMenu, adminTopMenu } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

export default function AdminMobileNavDrawer() {
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
        className="flex items-center justify-center rounded-full p-2 text-textcolor-secondary transition-colors hover:bg-black/5 md:hidden"
      >
        <PanelRight size={22} />
      </button>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" aria-hidden onClick={() => setOpen(false)} />}

      {/* Drawer - slides in from the right */}
      <div
        className={`admin-background fixed inset-y-0 right-0 z-50 flex w-[85vw] flex-col overflow-hidden shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header row */}
        <div className="flex shrink-0 items-center justify-end px-4 py-4">
          <button
            type="button"
            aria-label={t('closeNavigation')}
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable area */}
        <div className="min-h-0 w-full flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            <SidebarMenu menu={adminSidebarMenu} type="admin" onLinkClick={() => setOpen(false)} />
          </div>

          {/* Quick links (adminTopMenu) */}
          <div className="m-4 rounded border border-white/20 px-4 py-3">
            <button
              type="button"
              onClick={() => setTopOpen((v) => !v)}
              className="flex w-full items-center justify-between text-xs tracking-wide text-white/60"
            >
              <span>{t('quickLinks')}</span>
              <ChevronDown size={16} className={`transition-transform ${topOpen ? 'rotate-180' : ''}`} />
            </button>

            {topOpen && (
              <ul className="mt-2 flex flex-col gap-1 pb-4">
                {adminTopMenu.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded px-2 py-2 text-sm transition-colors hover:bg-white/10 ${
                          isActive ? 'font-semibold text-white' : 'text-white/70'
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
