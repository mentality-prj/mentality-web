'use client'
import { useTranslations } from 'next-intl'

import { guideMenu } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

export function GuideInnerMenu() {
  const t = useTranslations('pages.Guide')
  const pathname = usePathname()

  return (
    <nav className="mb-4 flex">
      <ul className="inner-menu">
        {guideMenu.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/')
          return (
            <li key={it.key}>
              <Link href={it.href} className={`inner-menu-item ${active ? 'active' : ''}`}>
                {t(`${it.key}.title`)}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default GuideInnerMenu
