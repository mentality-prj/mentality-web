import { useTranslations } from 'next-intl'

import { TopMenuType } from '@/constants/menu'
import { Link } from '@/i18n/navigation'

const TopMenu = ({ menu, pathname }: { menu: TopMenuType; pathname: string }) => {
  const t = useTranslations('components.Navbar')
  return (
    <nav className="hidden items-center gap-8 text-base font-normal leading-[120%] tracking-normal text-[var(--title-color)] md:flex">
      {menu.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`flex items-center gap-1 transition-colors hover:underline ${isActive ? 'border-b-1 border-[var(--primary)] font-semibold text-[var(--primary)]' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {'icon' in item && item.icon && <item.icon className="h-5 w-5" size={12} />}
            {t(item.key)}
          </Link>
        )
      })}
    </nav>
  )
}

export default TopMenu
