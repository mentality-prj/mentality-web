'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function ProfileButton() {
  const session = useSession()

  return (
    <>
      {session.data ? (
        <Link className="rounded-lg border border-white bg-slate-500 p-4" href="/profile">
          Profile
        </Link>
      ) : (
        <Link className="rounded-lg border border-white bg-slate-500 p-4" href="/api/auth/signin">
          Login
        </Link>
      )}
    </>
  )
}
