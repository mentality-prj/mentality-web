'use client'

import { useTranslations } from 'next-intl'

import { userTopMenu } from '@/constants/menu'
import { Link, usePathname } from '@/i18n/navigation'

type Props = {
  onLinkClick: () => void
}

export function TopMenuList({ onLinkClick }: Props) {
  const t = useTranslations('components.Navbar')
  const pathname = usePathname()

  return (
    <ul className="mt-2 flex flex-col gap-1 pb-4">
      {userTopMenu.map((item) => {
        const isActive = pathname === item.href
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className={`block rounded px-2 py-2 text-sm transition-colors hover:bg-background-muted ${
                isActive ? 'font-semibold text-primary' : 'text-textcolor-secondary'
              }`}
            >
              {t(item.key)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
