'use client'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Button } from '@/ui/button'

export default function SignOutButton() {
  const t = useTranslations('common.Buttons')
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }

  return <Button onClick={handleSignOut}>{t('signOut')}</Button>
}
