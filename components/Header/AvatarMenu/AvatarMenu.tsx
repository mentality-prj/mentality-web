'use client'
import { MailIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/ds/shadcn/avatar'
import { Button } from '@/ds/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ds/shadcn/dropdown-menu'
import { SUPPORTED_LANGUAGES } from '@/types/languages'

import { getMenuItems } from './avatarMenu.config'

const AvatarMenu = () => {
  const t = useTranslations('components.AvatarMenu')
  const router = useRouter()
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : SUPPORTED_LANGUAGES.UKRAINIAN
  const { data } = useSession()
  const user = data?.user
  const { name, email, image, role } = user || {}

  const menuItems = getMenuItems(locale, role || 'user', t, router)

  const initials = (name ?? '')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="iconButton" className="rounded-full" size="iconButton">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image ?? undefined} alt={name ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="overflow-hidden rounded bg-background">
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
        {menuItems
          .filter((item) => item.show && item.key !== 'logout')
          .map((item) => (
            <DropdownMenuItem key={item.key} onClick={item.onClick} className={item.className}>
              {item.label}
            </DropdownMenuItem>
          ))}
        <hr className="separator" />
        {menuItems
          .filter((item) => item.show && item.key === 'logout')
          .map((item) => (
            <DropdownMenuItem key={item.key} asChild>
              {item.element}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarMenu
