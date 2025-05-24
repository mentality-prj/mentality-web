import { signOut } from 'next-auth/react'

import { Routes } from '@/constants/routes'
import { LogOutIcon } from '@/ds/icons/logout'

export default function LogOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }

  return (
    <button
      className="flex gap-2 px-4 py-2 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-0"
      onClick={handleSignOut}
    >
      <LogOutIcon />
      <span className="group-data-[collapsible=icon]:hidden">Log out</span>
    </button>
  )
}
