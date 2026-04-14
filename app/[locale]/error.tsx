'use client'

import { useEffect } from 'react'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-col items-center justify-center gap-xs">
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>

      <Link href={Routes.MAIN}>Back to home</Link>
    </main>
  )
}
