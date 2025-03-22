'use client'
import { Key, useTransition } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

import { Languages } from '@/constants/i18n'

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
    <Dropdown className="w-auto min-w-0">
      <DropdownTrigger>
        <Button
          disabled={isPending}
          variant="light"
          radius="full"
          size="sm"
          className="h-10 min-h-10 w-10 min-w-10 p-1"
        >
          {localActive}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language actions"
        onAction={(actionKey) => onSelectChange(actionKey)}
        className="w-auto"
      >
        <DropdownItem key="uk">{Languages.UKRAINIAN}</DropdownItem>
        <DropdownItem key="en">{Languages.ENGLISH}</DropdownItem>
        <DropdownItem key="pl">{Languages.POLISH}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
