'use client'
import { Logo } from '@/components/Layout/Header'
import TopMenu from '@/components/Layout/TopMenu/TopMenu'
import { adminTopMenu } from '@/constants/menu'

const AdminHeader = () => {
  return (
    <header className="flex w-full items-center justify-between bg-white py-4">
      <div className="flex items-center gap-sm">
        <span className="hidden md:block">
          <Logo />
        </span>
      </div>
      <div className="mr-4 flex items-center gap-default md:mr-10">
        <TopMenu menu={adminTopMenu} />
      </div>
    </header>
  )
}

export default AdminHeader
