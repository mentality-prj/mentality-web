'use client'
import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'

export default function LogOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }
  const t = useTranslations('components.Navigation')

  return (
    <button onClick={handleSignOut} className="dropdown-menu-item flex w-full items-center gap-1" type="submit">
      <LogOutIcon size={16} />
      <span className="group-data-[collapsible=icon]:hidden">{t('LogOut')}</span>
    </button>
  )
}
