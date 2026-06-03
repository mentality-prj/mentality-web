'use client'
import { MailIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { Link } from '@/i18n/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

import { type AvatarMenuItem, getMenuItems } from './avatarMenu.config'

function isLinkMenuItem(item: AvatarMenuItem): item is Extract<AvatarMenuItem, { href: string }> {
  return item.show && 'href' in item
}

function isLogoutMenuItem(item: AvatarMenuItem): item is Extract<AvatarMenuItem, { key: 'logout' }> {
  return item.show && item.key === 'logout'
}

const AvatarMenu = () => {
  const t = useTranslations('components.AvatarMenu')
  const { session: data } = useAuth()
  const user = data?.user
  const { name, email, image, role, companyRole } = user || {}

  const menuItems = getMenuItems(role || 'user', companyRole, t)

  const initials = (name ?? '')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="iconButton" className="rounded-full" size="iconLG">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image ?? undefined} alt={name ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="max-h-[calc(100dvh-5rem)] overflow-y-auto rounded bg-background">
        <DropdownMenuLabel>
          <div className="w-auto text-center">
            <div className="flex items-center gap-1">
              <UserIcon size={12} />
              {name}
            </div>
            <div className="flex items-center gap-1">
              <MailIcon size={12} />
              {email && <div className="text-xs">{email}</div>}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.filter(isLinkMenuItem).map((item) => (
          <DropdownMenuItem key={item.key} asChild className={item.className}>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        <hr className="separator" />
        {menuItems.filter(isLogoutMenuItem).map((item) => (
          <DropdownMenuItem key={item.key} asChild>
            {item.element}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarMenu
