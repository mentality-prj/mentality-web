'use client'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/ui/button'

export default function SignOutButton() {
  const t = useTranslations('common.Buttons')
  const { logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
  }

  return <Button onClick={handleSignOut}>{t('signOut')}</Button>
}
