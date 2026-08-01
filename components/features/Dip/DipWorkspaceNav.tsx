'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Props = { locale: string }

export function DipWorkspaceNav({ locale }: Props) {
  const t = useTranslations('pages.Dip')
  const pathname = usePathname()

  const sections = [
    { key: 'research', label: t('nav.research') },
    { key: 'data', label: t('nav.data') },
    { key: 'models', label: t('nav.models') },
    { key: 'decisions', label: t('nav.decisions') },
    { key: 'system', label: t('nav.system') },
  ]

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-screen-xl px-6">
        <div className="flex gap-0 overflow-x-auto">
          {sections.map(({ key, label }) => {
            const href = `/${locale}/admin/dip/${key}`
            const isActive = pathname.includes(`/admin/dip/${key}`)
            return (
              <Link
                key={key}
                href={href}
                className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-textcolor-primary'
                    : 'border-transparent text-textcolor-secondary hover:text-textcolor-primary'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
