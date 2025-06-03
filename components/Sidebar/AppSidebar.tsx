'use client'

import Link from 'next/link'

import { SidebarList } from '@/constants/sidebar'
import { LogoIcon } from '@/ds/icons/logo'
import { MaximizeIcon } from '@/ds/icons/maximize'
import { MinimizeIcon } from '@/ds/icons/minimize'
import { Button } from '@/ds/shadcn/button'
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
  useSidebar,
} from '@/ds/shadcn/sidebar'
import { usePathname } from '@/i18n/routing'

import { AuthButton } from '../Buttons/AuthButton'

export const AppSidebar = () => {
  const pathname = usePathname()
  const isPageActive = (link: string) => pathname === link
  const { state, toggleSidebar } = useSidebar()
  const sidebarList = SidebarList()

  return (
    <Sidebar className="border-none bg-surface-white px-6 py-8" collapsible="icon">
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
                        className="h-10 rounded-sm p-0 px-4 py-2 text-base text-[#17171c] data-[active=true]:bg-secondary data-[active=true]:text-primary group-data-[collapsible=icon]:max-h-6 group-data-[collapsible=icon]:max-w-6 group-data-[collapsible=icon]:!p-0 [&>svg]:size-6"
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
              <SidebarSeparator className="mx-0 mb-4 mt-6 bg-outline-tertiary group-data-[collapsible=icon]:my-6" />
            )}
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-2 overflow-hidden bg-surface-white p-0">
        <Button className="h-6 w-6" onClick={toggleSidebar} variant="iconButton" size="icon">
          {state === 'collapsed' ? <MaximizeIcon /> : <MinimizeIcon />}
        </Button>
        <AuthButton />
      </SidebarFooter>
    </Sidebar>
  )
}
