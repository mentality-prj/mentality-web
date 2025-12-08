import { useRouter } from 'next/navigation'
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
  role?: string
}

export const UserMenu = ({ name, email, avatarUrl, role }: UserMenuProps) => {
  const t = useTranslations('components.UserMenu')
  const router = useRouter()
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'uk'
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="iconButton" className="rounded-full hover:ring-1 hover:ring-primary-hover">
          <Avatar className="h-10 w-10">
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
        <DropdownMenuItem
          onClick={() => router.push(`/${locale}/profile`)}
          className="hover:bg-primary/20 cursor-pointer"
        >
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/${locale}/settings`)}
          className="hover:bg-primary/20 cursor-pointer"
        >
          {t('settings')}
        </DropdownMenuItem>
        {role === 'admin' && (
          <DropdownMenuItem
            onClick={() => router.push(`/${locale}/admin`)}
            className="hover:bg-primary/20 cursor-pointer"
          >
            {t('admin')}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
