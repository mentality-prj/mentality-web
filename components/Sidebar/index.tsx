import { ReactNode } from 'react'

import { SidebarProvider, SidebarTrigger } from '@/ds/shadcn/sidebar'

import { AppSidebar } from './AppSidebar'

interface Props {
  children: ReactNode
}

export default function SidebarWrapper({ children }: Props) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          '--sidebar-width': '260px',
          '--sidebar-width-icon': '80px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarTrigger />
      {children}
    </SidebarProvider>
  )
}
