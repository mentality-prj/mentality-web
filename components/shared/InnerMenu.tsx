'use client'
import { ReactNode, useId, useState } from 'react'
import { ChevronDown, Menu as LucideMenu } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'

export type InnerMenuItem = {
  key: string
  href: string
  label: string
  icon?: ReactNode
}

export function InnerMenu({ items }: { items: InnerMenuItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const id = useId()
  const menuId = `inner-menu-${id}`
  const selectedItem = items.find((it) => pathname === it.href || pathname.startsWith(it.href + '/'))

  return (
    <nav className="mb-4 flex">
      <div className={`inner-menu flex-col md:flex-row`}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          className={`inner-menu-item w-full justify-between md:hidden ${open ? 'active' : ''}`}
        >
          <span className="flex items-center gap-xs">
            <LucideMenu className="icon h-4 w-4" aria-hidden />
            <span className="text-sm font-medium">{selectedItem?.label ?? 'Меню'}</span>
          </span>

          <ChevronDown className={`h-5 w-5 transform transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>

        <ul id={menuId} className={`${open ? 'block' : 'hidden'} w-auto md:flex md:flex-row md:items-center`}>
          {items.map((it) => {
            const active = pathname === it.href || pathname.startsWith(it.href + '/')
            return (
              <li key={it.key} className="flex h-full w-auto">
                <Link
                  href={it.href}
                  className={`inner-menu-item w-full transition-colors ${active ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {it.icon}
                  <span>{it.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
