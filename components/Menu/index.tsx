'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { menu } from '@/constants/routes'
import { capitalizeFirstLetter } from '@/helpers/gloabal'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export default function MenuComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const lastSegment = pathname.split('/').pop() || ''

  const isPageActive = (key: string) => key.endsWith(lastSegment)

  const menuMap = menu.map((item) => (
    <NavbarItem
      key={item.key}
      isActive={isPageActive(item.link)}
      className="m-0 rounded-lg px-4 py-3 data-[active=true]:bg-default-50"
    >
      <Link href={item.link} color="foreground">
        {capitalizeFirstLetter(item.key)}
      </Link>
    </NavbarItem>
  ))

  const menuMobileMap = menu.map((item) => (
    <NavbarMenuItem key={item.key}>
      <Link className="w-full" href={item.link}>
        {capitalizeFirstLetter(item.key)}
      </Link>
    </NavbarMenuItem>
  ))

  return (
    <Navbar
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      className="w-full"
      classNames={{
        wrapper: 'w-full max-w-full',
      }}
    >
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {menuMap}
      </NavbarContent>

      <NavbarMenu className="mt-16">{menuMobileMap}</NavbarMenu>
    </Navbar>
  )
}
