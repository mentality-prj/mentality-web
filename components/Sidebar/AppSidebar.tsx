'use client'
import { useSidebarList } from '@/components/Sidebar/SidebarList'
import { LogoIcon } from '@/ds/icons/logo'
import { MaximizeIcon } from '@/ds/icons/maximize'
import { MinimizeIcon } from '@/ds/icons/minimize'
import { Button } from '@/ds/shadcn/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/ds/shadcn/sidebar'
import { Link, usePathname } from '@/i18n/navigation'

export const AppSidebar = () => {
  const pathname = usePathname()
  const isPageActive = (link: string) => pathname === link
  const { state, toggleSidebar } = useSidebar()
  const { sidebarUpLineMenu, sidebarUnderLineMenu } = useSidebarList()
  return (
    <Sidebar className="group border-none" collapsible="icon">
      <SidebarHeader className="mx-6 mt-8 flex flex-row justify-between p-0 pl-4 group-data-[collapsible=icon]:flex-col-reverse group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-4 group-data-[collapsible=icon]:pl-0">
        <div className="overflow-hidden">
          <LogoIcon />
        </div>
        <Button
          className="h-6 w-6 opacity-0 transition-opacity focus:bg-transparent focus:outline-none focus:ring-0 group-hover:opacity-100 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:opacity-100"
          onClick={toggleSidebar}
          variant="iconButton"
          size="icon"
        >
          {state === 'collapsed' ? <MaximizeIcon /> : <MinimizeIcon />}
        </Button>
      </SidebarHeader>

      <SidebarContent className="mx-6 mb-8 mt-4 gap-0">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {sidebarUpLineMenu.map((item) => (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton
                    isActive={isPageActive(item.link)}
                    asChild
                    className="h-10 rounded-sm p-0 px-4 py-2 text-base font-medium group-data-[collapsible=icon]:max-h-6 group-data-[collapsible=icon]:max-w-6 group-data-[collapsible=icon]:!p-0 [&>svg]:size-6"
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

        <SidebarSeparator className="mx-0 my-4 bg-outline-tertiary" />

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarUnderLineMenu.map((item) => (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton
                    isActive={isPageActive(item.link)}
                    asChild
                    className="h-10 rounded-sm p-0 px-4 py-2 text-base font-medium group-data-[collapsible=icon]:max-h-6 group-data-[collapsible=icon]:max-w-6 group-data-[collapsible=icon]:!p-0 [&>svg]:size-6"
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
      </SidebarContent>
    </Sidebar>
  )
}
