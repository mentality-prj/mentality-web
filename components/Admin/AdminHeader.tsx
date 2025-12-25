'use client'
import { AdminNav } from '@/components/Admin'
import { Logo } from '@/components/Header'

const AdminHeader = () => {
  return (
    <header className="flex w-full items-center justify-between bg-white py-4">
      <div className="flex items-center gap-4">
        <Logo />
      </div>
      <nav className="mr-10 flex items-center gap-6">
        <AdminNav />
      </nav>
    </header>
  )
}

export default AdminHeader
