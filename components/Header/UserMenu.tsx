import { useTranslations } from 'next-intl'

import LogOutButton from '@/components/Buttons/LogOutButton'
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

interface UserMenuProps {
  name: string
  email?: string
  avatarUrl?: string
}

export const UserMenu = ({ name, email, avatarUrl }: UserMenuProps) => {
  const t = useTranslations()
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="iconButton" size="icon">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-0 bg-surface-white p-3 text-center">
        <DropdownMenuLabel className="rounded-md bg-surface-primary p-3">
          <div>{name}</div>
          {email && <div className="text-xs">{email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{t('UserMenu.Profile')}</DropdownMenuItem>
        <DropdownMenuItem>{t('UserMenu.Settings')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
