'use client'

import { useEffect, useState } from 'react'

type Props = {
  locale: string
}

export function ApiKeyFlashBanner({ locale }: Props) {
  const [key, setKey] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadKey(): Promise<void> {
      try {
        const response = await fetch(`/${locale}/admin/dip/system/key-flash`, {
          method: 'GET',
          cache: 'no-store',
        })

        if (response.status === 204) {
          return
        }

        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as { key?: string }
        if (!cancelled && payload.key) {
          setKey(payload.key)
        }
      } catch {
        // Ignore flash retrieval failures and keep the page usable.
      }
    }

    loadKey()

    return () => {
      cancelled = true
    }
  }, [locale])

  if (!key) {
    return null
  }

  return (
    <div className="mb-8 whitespace-pre-line rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
      {`Copy the new key now: ${key}`}
    </div>
  )
}
