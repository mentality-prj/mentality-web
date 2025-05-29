import { ReactNode } from 'react'

import { SidebarProvider } from '@/ds/shadcn/sidebar'

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
          '--sidebar-width': '275px',
          '--sidebar-width-icon': '80px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      {children}
    </SidebarProvider>
  )
}
