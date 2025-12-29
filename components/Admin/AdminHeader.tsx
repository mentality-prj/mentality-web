'use client'
import { Logo } from '@/components/Header'
import { adminTopMenu } from '@/constants/menu'

import TopMenu from '../TopMenu/TopMenu'

const AdminHeader = ({ pathname }: { pathname: string }) => {
  return (
    <header className="flex w-full items-center justify-between bg-white py-4">
      <div className="flex items-center gap-4">
        <Logo />
      </div>
      <nav className="mr-10 flex items-center gap-6">
        <TopMenu menu={adminTopMenu} pathname={pathname} />
      </nav>
    </header>
  )
}

export default AdminHeader
