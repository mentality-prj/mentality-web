'use client'
import { LogOutIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'

export default function LogOutButton() {
  const { logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
  }
  const t = useTranslations('components.Navigation')

  return (
    <button onClick={handleSignOut} className="dropdown-menu-item flex w-full items-center gap-1" type="submit">
      <LogOutIcon size={16} />
      <span className="group-data-[collapsible=icon]:hidden">{t('LogOut')}</span>
    </button>
  )
}
