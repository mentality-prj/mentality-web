'use client'

import { useSession } from 'next-auth/react'

import LoginButton from './LoginButton'
import LogOutButton from './LogOutButton'

export const AuthButton = () => {
  const { data: session, status } = useSession()

  const user = session?.OAuthToken && session.user ? session.user : null

  // Handle loading state to prevent UI flash
  if (status === 'loading') {
    return <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
  }

  if (status === 'unauthenticated' || !session || !user) {
    return <LoginButton />
  }

  return <LogOutButton />
}
