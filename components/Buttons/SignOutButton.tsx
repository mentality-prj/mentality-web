'use client'
import { Button } from '@nextui-org/react'
import { signOut } from 'next-auth/react'

import { Routes } from '@/constants/routes'
import { Texts } from '@/constants/texts'

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: Routes.MAIN })
  }

  return (
    <Button color="primary" onClick={handleSignOut}>
      {Texts.LOGOUT}
    </Button>
  )
}
