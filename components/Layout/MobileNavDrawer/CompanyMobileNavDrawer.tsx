'use client'

import { useState } from 'react'
import { ChevronDown, Menu as LucideMenu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Logo from '@/components/Layout/Header/Logo'
import { TopMenuList } from '@/components/Layout/MobileNavDrawer/TopMenuList'
import SidebarMenu from '@/components/Layout/Sidebar/SidebarMenu'
import { SidebarMenuItemType } from '@/constants/menu'

export default function CompanyMobileNavDrawer({
  menu,
  extra,
}: {
  menu?: SidebarMenuItemType[]
  extra?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [topOpen, setTopOpen] = useState(false)
  const t = useTranslations('components.Navbar')

  return (
    <>
      <button
        type="button"
        aria-label={t('openNavigation')}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center text-textcolor-secondary md:hidden"
      >
        <LucideMenu size={22} />
      </button>

      {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" aria-hidden onClick={() => setOpen(false)} />}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
        <div className="flex min-h-0 w-full flex-col gap-sm overflow-y-auto p-4">
          {extra}

          {/* Main navigation menu - only show if there are items, otherwise it would just be an empty section */}
          {menu && menu.length > 0 && <SidebarMenu menu={menu} onLinkClick={() => setOpen(false)} />}

          <div className="rounded border border-border px-4 py-3">
            <button
              type="button"
              onClick={() => setTopOpen((v) => !v)}
              className="flex w-full items-center justify-between text-xs tracking-wide text-textcolor-secondary"
            >
              <span>{t('quickLinks')}</span>
              <ChevronDown size={16} className={`transition-transform ${topOpen ? 'rotate-180' : ''}`} />
            </button>

            {topOpen && <TopMenuList onLinkClick={() => setOpen(false)} />}
          </div>
        </div>
      </div>
    </>
  )
}
