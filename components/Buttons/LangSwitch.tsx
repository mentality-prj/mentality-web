'use client'
import { Key, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

import { Languages } from '@/constants/i18n'
import { Button } from '@/ds/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ds/shadcn/dropdown-menu'

export default function LangSwitch() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const localActive = useLocale()
  const pathname = usePathname()

  const onSelectChange = (actionKey: Key) => {
    const currentPath = pathname.replace(/^\/(en|uk|pl)/, '')
    startTransition(() => {
      router.replace(`/${actionKey}${currentPath}`)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isPending}
          variant="textButton"
          size="icon"
          className="group data-[state=open]:bg-secondary-hover"
        >
          {localActive}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        aria-label="Language actions"
        className="w-auto min-w-0 bg-surface-white px-0 text-center"
      >
        <DropdownMenuItem
          className="justify-center px-3 hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed"
          onSelect={() => onSelectChange('uk')}
        >
          {Languages.UKRAINIAN}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-center px-3 hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed"
          onSelect={() => onSelectChange('en')}
        >
          {Languages.ENGLISH}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-center px-3 hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed"
          onSelect={() => onSelectChange('pl')}
        >
          {Languages.POLISH}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
