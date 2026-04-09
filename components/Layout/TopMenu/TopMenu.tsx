'use client'
import { ReactNode } from 'react'
import { BookHeart, LayoutDashboard } from 'lucide-react'
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

  const textColor =
    type === APP_VIEW_TYPE.LANDING ? 'text-textcolor-primary hover:text-primary' : 'text-remark hover:text-title-light'

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-sm font-normal leading-[120%] tracking-normal md:flex wide:gap-md">
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
    </>
  )
}

export default TopMenu
