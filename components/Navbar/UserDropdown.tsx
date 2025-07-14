'use client'
import { useSession } from 'next-auth/react'

import { SignOut } from '@/components/Buttons'
import { Routes } from '@/constants/routes'
import { Texts } from '@/constants/texts'
import { Avatar, AvatarFallback, AvatarImage } from '@/ds/shadcn/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ds/shadcn/dropdown-menu'
import { useRouter } from '@/i18n/navigation'
import { CustomSession } from '@/types/auth'

export default function UserDropdown() {
  const router = useRouter()
  const { data } = useSession()

  const session = data as CustomSession
  const user = session?.OAuthToken && session.user ? session.user : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || undefined} alt="your avatar" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" aria-label="User menu actions">
        <DropdownMenuItem onSelect={() => router.replace(Routes.PROFILE)}> {user?.email} </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.replace(Routes.ADMIN)}> {Texts.ADMIN} </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log('Logout clicked')} className="text-danger">
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
