'use client'
import { useState } from 'react'
import { Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

import { menu, RoutesTitles } from '@/constants/routes'
import { Link } from '@/i18n/routing'

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isPageActive = (key: string) => pathname.includes(key)

  const menuMap = menu.map((item) => (
    <NavbarItem
      key={item.key}
      isActive={isPageActive(item.link)}
      className="m-0 rounded-lg px-4 py-3 data-[active=true]:bg-default-50"
    >
      <Link href={item.link} color="foreground">
        {RoutesTitles[item.key]}
      </Link>
    </NavbarItem>
  ))

  const menuMobileMap = menu.map((item) => (
    <NavbarMenuItem key={item.key}>
      <Link className="w-full" href={item.link}>
        {RoutesTitles[item.key]}
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

      <NavbarMenu>{menuMobileMap}</NavbarMenu>
    </Navbar>
  )
}
