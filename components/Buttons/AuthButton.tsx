'use client'

import { useSession } from 'next-auth/react'

import { CustomSession } from '@/types/auth'

import LoginButton from './LoginButton'
import LogOutButton from './LogOutButton'

export const AuthButton = () => {
  const { data, status } = useSession()

  const session = data as CustomSession
  const user = session?.OAuthToken && session.user ? session.user : null

  if (!session || !user || status === 'unauthenticated') {
    return <LoginButton />
  }

  return <LogOutButton />
}
