'use client'
import { useTranslations } from 'next-intl'

import { iconMap } from '@/components/Sitemap'
import { guideMenu } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

export default function GuideInnerMenu() {
  const t = useTranslations('pages.Guide')
  const pathname = usePathname()

  return (
    <nav className="mb-4 flex">
      <ul className="inner-menu">
        {guideMenu.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/')
          return (
            <li key={it.key}>
              <Link href={it.href} className={`inner-menu-item transition-colors ${active ? 'active' : ''}`}>
                {it.icon && iconMap[it.icon]}
                <span>{t(`${it.key}.title`)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
