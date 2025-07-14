'use client'

import { useEffect } from 'react'

import { Routes } from '@/constants/routes'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-col items-center justify-center gap-3">
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>

      <Link href={Routes.MAIN}>Back to home</Link>
    </main>
  )
}
