'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

type ErrorProps = { error: Error & { digest?: string }; reset: () => void }

const copy = {
  uk: { title: 'Не вдалося завантажити сторінку', retry: 'Спробувати знову' },
  en: { title: 'Page failed to load', retry: 'Try again' },
  pl: { title: 'Nie udało się załadować strony', retry: 'Spróbuj ponownie' },
}

export default function ProtectedError({ error, reset }: ErrorProps) {
  const locale = useLocale()
  const words = copy[locale as keyof typeof copy] ?? copy.uk
  useEffect(() => {
    console.error('Protected page error', error.digest ?? 'unknown')
  }, [error.digest])

  return (
    <div role="alert" className="flex flex-col items-start gap-4 rounded-xl border p-6">
      <h2 className="text-lg font-semibold">{words.title}</h2>
      <button type="button" onClick={reset} className="rounded-lg bg-primary px-4 py-2 text-white">
        {words.retry}
      </button>
    </div>
  )
}
