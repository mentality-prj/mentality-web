import { auth } from '@/auth'
import { BellIcon } from '@/components/icons/navbar/bell-icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/ds/shadcn/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ds/shadcn/dropdown-menu'
import { CustomSession } from '@/types/auth'

export default async function Header() {
  const session = (await auth()) as CustomSession

  const user = session?.user
  const initials = user?.name
    ?.split(' ')
    .map((word) => word[0].toUpperCase())
    .join('')
  return (
    <header className="flex items-center justify-between rounded-b-2xl bg-card px-6 py-2">
      <p>Welcome back, {user?.name} </p>
      <div className="flex items-center gap-6">
        <BellIcon />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || undefined} alt="your avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {user?.name}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" aria-label="User menu actions">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
