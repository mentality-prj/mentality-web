'use client'
import { ReactNode, useId, useState } from 'react'
import { BookHeart, LayoutDashboard, Menu as LucideMenu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { APP_VIEW_TYPE, AppViewType } from '@/constants/general'
import { TopMenuType } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

const iconMap: Record<string, ReactNode> = {
  bookHeart: <BookHeart className="h-5 w-5" size={12} />,
  layoutDashboard: <LayoutDashboard className="h-5 w-5" size={12} />,
}

const TopMenu = ({ menu, type }: { menu: TopMenuType; type?: AppViewType }) => {
  const t = useTranslations('components.Navbar')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const id = useId()
  const menuId = `top-menu-${id}`

  const textColor =
    type === APP_VIEW_TYPE.LANDING ? 'text-textcolor-primary hover:text-primary' : 'text-remark hover:text-title-light'

  const mobileBg = type === APP_VIEW_TYPE.LANDING ? 'bg-white' : 'bg-white'

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-md font-normal leading-[120%] tracking-normal md:flex">
        {menu.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-1 transition-colors ${textColor} ${isActive ? 'font-semibold' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon && iconMap[item.icon]}
              <span className={type === APP_VIEW_TYPE.LANDING ? 'menu-hover-landing' : 'menu-hover'}>
                {t(item.key)}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile burger */}
      <div className="relative hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center justify-center p-1 transition-colors ${textColor}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <LucideMenu size={22} />}
        </button>

        {open && (
          <div
            id={menuId}
            className={`absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-border ${mobileBg} py-2 shadow-lg`}
          >
            {menu.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-background-muted ${
                    isActive ? 'font-semibold text-primary' : 'text-textcolor-primary'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon && iconMap[item.icon]}
                  {t(item.key)}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default TopMenu
