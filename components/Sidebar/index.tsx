import { ReactNode } from 'react'

import { AppSidebar } from './AppSidebar'

interface Props {
  children: ReactNode
}

export default function SidebarWrapper({ children }: Props) {
  return (
    <>
      <AppSidebar />
      {children}
    </>
  )
}
