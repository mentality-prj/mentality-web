'use client'

import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <>
      <Button onClick={() => signOut({ callbackUrl: '/' })}>
        <Link href="#">Sign Out</Link>
      </Button>
    </>
  )
}
