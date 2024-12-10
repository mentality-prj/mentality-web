'use client'
import { signOut } from 'next-auth/react'

import { Routes } from '@/constants/routes'
import { Texts } from '@/constants/texts'

export default function SignOut() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }

  return (
    <span role="button" tabIndex={0} onClick={handleSignOut} onKeyDown={handleSignOut}>
      {Texts.LOGOUT}
    </span>
  )
}
