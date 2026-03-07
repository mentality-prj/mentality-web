'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu as LucideMenu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Logo from '@/components/Layout/Header/Logo'
import { landingMenu } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

export default function LandingMobileMenu() {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const t = useTranslations('components.Navbar')
  const pathname = usePathname()

  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return

    if (open) {
      drawer.removeAttribute('inert')
      return
    }

    // Use native DOM attribute instead of JSX prop to avoid React warnings for non-boolean attributes.
    drawer.setAttribute('inert', '')
  }, [open])

  return (
    <>
      {/* Burger trigger */}
      <button
        type="button"
        aria-label={t('openNavigation')}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center text-textcolor-secondary md:hidden"
      >
        <LucideMenu size={22} />
      </button>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" aria-hidden onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('openNavigation')}
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
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

        {/* Nav links */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
          <ul className="flex flex-col gap-1">
            {landingMenu.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded px-3 py-3 text-sm font-medium transition-colors hover:bg-background-muted ${
                      isActive ? 'text-primary' : 'text-textcolor-secondary'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
