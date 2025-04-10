import { Slot } from '@radix-ui/react-slot'
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
    <SidebarItemButton
      asChild
      className={cn(
        isActive ? 'bg-secondary text-primary [&_svg_circle]:stroke-primary [&_svg_path]:stroke-primary' : ''
      )}
    >
      <Link href={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </SidebarItemButton>
  </li>
)
interface SidebarItemButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}
export const SidebarItemButton = ({ asChild, className, ...props }: SidebarItemButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(
        'flex items-center gap-2 rounded-lg bg-transparent py-2 pl-4 font-medium transition-colors hover:bg-secondary hover:text-primary-hover focus-visible:bg-secondary focus-visible:text-primary-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus active:bg-secondary-pressed active:text-white [&_svg_circle]:transition-colors [&_svg_circle]:hover:stroke-primary-hover [&_svg_circle]:focus-visible:stroke-primary-focus [&_svg_circle]:active:stroke-white [&_svg_path]:transition-colors [&_svg_path]:hover:stroke-primary-hover [&_svg_path]:focus-visible:stroke-primary-focus [&_svg_path]:active:stroke-white',
        className
      )}
      {...props}
    />
  )
}
