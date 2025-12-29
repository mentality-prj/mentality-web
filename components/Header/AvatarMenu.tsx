'use client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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

import { SUPPORTED_LANGUAGES } from '../../types/languages'

const AvatarMenu = () => {
  const t = useTranslations('components.AvatarMenu')
  const router = useRouter()
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : SUPPORTED_LANGUAGES.UKRAINIAN
  const { data } = useSession()
  const user = data?.user
  const { name, email, image, role } = user || {}

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

      <DropdownMenuContent align="end" className="bg-background-alt-white w-auto min-w-0 p-3 text-center">
        <DropdownMenuLabel className="bg-background-alt-primary rounded-md p-3">
          <div>{name}</div>
          {email && <div className="text-xs">{email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/${locale}/profile`)}
          className="cursor-pointer hover:bg-primary/20"
        >
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/${locale}/settings`)}
          className="cursor-pointer hover:bg-primary/20"
        >
          {t('settings')}
        </DropdownMenuItem>
        {role === 'admin' && (
          <DropdownMenuItem
            onClick={() => router.push(`/${locale}/admin`)}
            className="cursor-pointer hover:bg-primary/20"
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

export default AvatarMenu
