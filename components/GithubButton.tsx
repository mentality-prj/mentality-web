'use client'

import { Button } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

const GithubButton = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/profile'

  return <Button onClick={() => signIn('github', { callbackUrl })}>Sign in with Github</Button>
}

export { GithubButton }
