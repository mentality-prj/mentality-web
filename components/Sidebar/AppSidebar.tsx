'use client'

import Link from 'next/link'

import { ArchiveIcon } from '@/ds/icons/archive'
import { BagIcon } from '@/ds/icons/bag'
import { ChartIcon } from '@/ds/icons/chart'
import { HomeIcon } from '@/ds/icons/home'
import { InfoIcon } from '@/ds/icons/info'
import { LogoIcon } from '@/ds/icons/logo'
import { SettingsIcon } from '@/ds/icons/settings'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/ds/shadcn/sidebar'
import { usePathname } from '@/i18n/routing'

import { AuthorizationContainer } from '../Buttons/AuthorizationContainer'

import ThemeSwitch from './ThemeSwitch'

export const sidebarList = [
  [
    { icon: <HomeIcon />, text: 'Home', link: '/' },
    { icon: <ChartIcon />, text: 'Dashboard', link: '/dashboard' },
    { icon: <BagIcon />, text: 'Shop', link: '/shop' },
    { icon: <ArchiveIcon />, text: 'Order History', link: '/order-history' },
  ],
  [
    { icon: <SettingsIcon />, text: 'Settings', link: '/settings' },
    { icon: <InfoIcon />, text: 'Support', link: '/support' },
  ],
]

export const AppSidebar = () => {
  const pathname = usePathname()
  const isPageActive = (link: string) => pathname === link

  return (
    <Sidebar className="border-none bg-surface-white px-6 py-4" collapsible="icon">
      <SidebarHeader className="overflow-hidden bg-surface-white p-0 pl-4 group-data-[collapsible=icon]:pl-0">
        <LogoIcon />
      </SidebarHeader>
      <SidebarContent className="mt-8 gap-0 bg-surface-white group-data-[collapsible=icon]:mt-10">
        {sidebarList.map((items, index) => (
          <div key={index}>
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-6">
                  {items.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        isActive={isPageActive(item.link)}
                        className="h-10 rounded-sm p-0 px-4 py-2 text-base text-textcolor-primary data-[active=true]:bg-secondary data-[active=true]:text-primary group-data-[collapsible=icon]:max-h-6 group-data-[collapsible=icon]:max-w-6 group-data-[collapsible=icon]:!p-0 [&>svg]:size-6"
                        asChild
                      >
                        <Link href={item.link}>
                          {item.icon}
                          <span>{item.text}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {index < sidebarList.length - 1 && (
              <SidebarSeparator className="mx-0 my-4 bg-outline-tertiary group-data-[collapsible=icon]:my-6" />
            )}
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-4 overflow-hidden bg-surface-white p-0">
        <ThemeSwitch />
        <AuthorizationContainer />
      </SidebarFooter>
    </Sidebar>
  )
}
