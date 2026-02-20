'use client'
import { Logo } from '@/components/Layout/Header'
import TopMenu from '@/components/Layout/TopMenu/TopMenu'
import { adminTopMenu } from '@/constants/menu'

const AdminHeader = () => {
  return (
    <header className="flex w-full items-center justify-between bg-white py-4">
      <div className="flex items-center gap-sm">
        <Logo />
      </div>
      <nav className="text-title mr-10 flex items-center gap-default">
        <TopMenu menu={adminTopMenu} />
      </nav>
    </header>
  )
}

export default AdminHeader
