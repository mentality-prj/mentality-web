'use client'
import { ReactNode } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

export type InnerMenuItem = {
  key: string
  href: string
  label: string
  icon?: ReactNode
}

export function InnerMenu({ items }: { items: InnerMenuItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="mb-4 flex">
      <ul className="inner-menu">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/')
          return (
            <li key={it.key}>
              <Link href={it.href} className={`inner-menu-item transition-colors ${active ? 'active' : ''}`}>
                {it.icon}
                <span>{it.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
