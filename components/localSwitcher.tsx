'use client'

import { ChangeEvent, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const localActive = useLocale()

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value
    startTransition(() => {
      router.replace(`/${nextLocale}`)
    })
  }
  return (
    <label className="rounded">
      <div className="sr-only text-black">change language</div>
      <select defaultValue={localActive} disabled={isPending} className="bg-transparent py-2" onChange={onSelectChange}>
        <option value="en " className="text-black">
          English
        </option>
        <option value="id " className="text-black">
          Indonesian
        </option>
      </select>
    </label>
  )
}