'use client'
import { useSession } from 'next-auth/react'

import { AvatarMenu, LangSwitch } from '@/components/Header'

import AdminSidebarMenu from './AdminSidebarMenu'

const AdminSidebar = () => {
  const { data } = useSession()
  const user = data?.user

  return (
    <aside className="admin-background flex w-64 flex-col rounded-l-3xl text-white">
      <div className="flex justify-between py-3 pl-6 pr-2">
        <div>
          <LangSwitch type="admin" />
        </div>
        <AvatarMenu
          name={user?.name ?? ''}
          email={user?.email ?? ''}
          avatarUrl={user?.image ?? ''}
          role={user?.role ?? ''}
        />
      </div>
      <div className="mb-4 ml-2 border border-x-0 border-y border-b-gray-500 border-t-gray-800" />
      <nav className="flex-1">
        <AdminSidebarMenu />
      </nav>
      {/* <div className="mt-10">
        <button className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-500 bg-gray-700 py-3 transition hover:bg-gray-600">
          <span className="mr-2 text-2xl">+</span> Add files
        </button>
        <div className="mt-2 text-center text-xs text-gray-400">Up to 2G</div>
      </div> */}
    </aside>
  )
}

export default AdminSidebar
