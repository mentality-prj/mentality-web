'use client'

import { ChangeEvent, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const localActive = useLocale()
  const pathname = usePathname()

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value

    const currentPath = pathname.replace(/^\/(en|uk|pl)/, '')
    console.log(nextLocale)
    startTransition(() => {
      router.replace(`/${nextLocale}${currentPath}`)
    })
  }
  return (
    <label className="rounded">
      <div className="sr-only text-black">change language</div>

      <select
        data-test="language-select"
        disabled={isPending}
        defaultValue={localActive}
        className="bg-transparent py-2"
        onChange={(e) => onSelectChange(e)}
      >
        <option value="en" className="text-black">
          English
        </option>
        <option value="uk" className="text-black">
          Ukrainian
        </option>
        <option value="pl" className="text-black">
          Polish
        </option>
      </select>
    </label>
  )
}
