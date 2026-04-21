'use client'
import { ReactNode } from 'react'
import { BookHeart, LayoutDashboard } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { APP_VIEW_TYPE, AppViewType } from '@/constants/general'
import { TopMenuType } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const iconMap: Record<string, ReactNode> = {
  bookHeart: <BookHeart className="h-5 w-5" size={12} />,
  layoutDashboard: <LayoutDashboard className="h-5 w-5" size={12} />,
}

const TopMenu = ({
  menu,
  type,
  collapseToMyDayOnTablet = false,
}: {
  menu: TopMenuType
  type?: AppViewType
  collapseToMyDayOnTablet?: boolean
}) => {
  const t = useTranslations('components.Navbar')
  const pathname = usePathname()

  const textColor = type === APP_VIEW_TYPE.LANDING ? 'text-textcolor-primary' : 'text-remark'

  return (
    <>
      {/* Desktop */}
      <nav
        className={cn(
          'hidden items-center gap-sm font-normal leading-[120%] tracking-normal md:flex wide:gap-md',
          collapseToMyDayOnTablet ? 'tablet:flex' : ''
        )}
      >
        {menu.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-1 whitespace-nowrap transition-colors hover:font-semibold ${isActive ? 'font-semibold text-primary' : textColor} ${collapseToMyDayOnTablet && item.key !== 'my-day' ? 'hidden desktop:flex' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon && iconMap[item.icon]}
              <span
                className={`${!isActive ? (type === APP_VIEW_TYPE.LANDING ? 'menu-hover-landing' : 'menu-hover') : ''}`}
              >
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
