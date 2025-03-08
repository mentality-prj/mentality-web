'use client'
import { signOut } from 'next-auth/react'

import { Routes } from '@/constants/routes'
import { Texts } from '@/constants/texts'
import { Button } from '@/ds/shadcn/button'

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }

  return <Button onClick={handleSignOut}>{Texts.LOGOUT}</Button>
}
