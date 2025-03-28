import Link from 'next/link'

import { cn } from '@/lib/utils'

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

export const SidebarItem = ({ href, icon, label, isActive = false }: SidebarItemProps) => (
  <li>
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-lg bg-transparent py-2 pl-4 font-medium transition-colors hover:bg-secondary hover:text-primary-hover focus-visible:bg-secondary focus-visible:text-primary-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus active:bg-secondary-pressed active:text-primary-foreground [&_svg_circle]:transition-colors [&_svg_circle]:hover:stroke-primary-hover [&_svg_circle]:focus-visible:stroke-primary-focus [&_svg_circle]:active:stroke-primary-foreground [&_svg_path]:transition-colors [&_svg_path]:hover:stroke-primary-hover [&_svg_path]:focus-visible:stroke-primary-focus [&_svg_path]:active:stroke-primary-foreground',
        isActive ? 'bg-secondary text-primary [&_svg_circle]:stroke-primary [&_svg_path]:stroke-primary' : ''
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
)
