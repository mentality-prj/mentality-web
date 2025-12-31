'use client'
import { ReactNode } from 'react'
import { BookHeart, LayoutDashboard } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { TopMenuType } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

const iconMap: Record<string, ReactNode> = {
  bookHeart: <BookHeart className="h-5 w-5" size={12} />,
  layoutDashboard: <LayoutDashboard className="h-5 w-5" size={12} />,
}

const TopMenu = ({ menu }: { menu: TopMenuType }) => {
  const t = useTranslations('components.Navbar')
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-8 font-normal leading-[120%] tracking-normal md:flex">
      {menu.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`flex items-center gap-1 transition-colors hover:text-textcolor-primary ${isActive ? 'font-semibold' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon && iconMap[item.icon]}
            <span className="menu-hover">{t(item.key)}</span>{' '}
          </Link>
        )
      })}
    </nav>
  )
}

export default TopMenu
