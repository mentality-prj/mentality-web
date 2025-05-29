import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { LogOutIcon } from '@/ds/icons/logout'

export default function LogOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }
  const t = useTranslations('Navigation')

  return (
    <button
      className="flex gap-2 py-2 pr-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-0"
      onClick={handleSignOut}
    >
      <LogOutIcon />
      <span className="group-data-[collapsible=icon]:hidden">{t('LogOut')}</span>
    </button>
  )
}
