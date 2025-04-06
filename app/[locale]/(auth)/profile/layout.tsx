import { ReactNode } from 'react'

import Header from '@/components/Layout/header'
import Sidebar from '@/components/Layout/sidebar'
import { Card } from '@/ds/shadcn'

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid h-full grid-cols-[263px_auto] grid-rows-[60px_auto] gap-6 bg-gray-95">
      <Sidebar />
      <Header />
      <main className="col-start-2 w-full">
        <Card className="h-fit w-full max-w-[1096px] border-none shadow-none">{children}</Card>
      </main>
    </div>
  )
}

export default ProfileLayout
