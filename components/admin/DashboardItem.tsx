import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'

interface Props {
  href: string
  icon: ReactNode
  title: string
  subtitle?: string
  badge?: ReactNode
}

export function DashboardItem({ href, icon, title, subtitle, badge }: Props) {
  return (
    <Link
      href={href}
      className="bg-surface hover:shadow-light flex items-center gap-sm rounded-md border border-border p-3 transition-all hover:bg-info"
    >
      <span className="shrink-0 text-textcolor-secondary">{icon}</span>
      <div className="flex flex-1 flex-col gap-xs">
        <span className="font-medium">{title}</span>
        {subtitle && <span className="text-xs text-textcolor-secondary">{subtitle}</span>}
      </div>
      {badge}
      <ChevronRight size={16} className="shrink-0 text-textcolor-secondary" />
    </Link>
  )
}
