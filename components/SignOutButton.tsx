import { Button } from '@nextui-org/react'

import { signOut } from '@/auth'
import { Routes } from '@/constants/routes'

function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirectTo: Routes.MAIN })
      }}
    >
      <Button color="primary" type="submit">
        Sign Out
      </Button>
    </form>
  )
}

export default SignOutButton
