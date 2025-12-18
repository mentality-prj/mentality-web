'use client'
import { useTransition } from 'react'
import { Globe } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

import { LocaleNativeLabels, LocaleTriggerShortLabels } from '@/constants/i18n'
import { Button } from '@/ds/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ds/shadcn/dropdown-menu'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/types/languages'

// Compact dropdown locale switcher aligned with Landing aesthetics
export default function LangSwitch() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const activeLocale = useLocale()
  const pathname = usePathname()

  const replaceLocale = (nextLocale: SupportedLanguage) => {
    const segments = pathname.split('/')
    const maybeLocale = segments[1] as SupportedLanguage | undefined
    const isLocalePrefixed = maybeLocale && SUPPORTED_LANGUAGES.includes(maybeLocale)
    const currentPath = isLocalePrefixed ? `/${segments.slice(2).join('/')}` : pathname
    startTransition(() => {
      router.replace(`/${nextLocale}${currentPath}`)
    })
  }

  const localeLabelNative = LocaleNativeLabels
  const localeTriggerShort = LocaleTriggerShortLabels

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isPending}
          variant="textIconButton"
          size="base"
          className="group flex h-12 items-center gap-1.5 rounded-full border-0 bg-transparent px-0 py-0 text-sm shadow-none outline-none ring-0 hover:bg-transparent focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:ring-0"
        >
          <span className="inline-flex w-4 items-center justify-center">
            <Globe size={18} className="text-textcolor-primary" />
          </span>
          <span className="text-sm font-medium leading-none text-textcolor-primary group-hover:underline">
            {localeTriggerShort[activeLocale as 'uk' | 'en' | 'pl']}
          </span>
          <span className="inline-flex w-3 items-center justify-center text-xs text-textcolor-tertiary">▾</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[200px] rounded-2xl bg-white px-0 py-2 text-textcolor-primary shadow-lg outline-none ring-0 focus:outline-none"
      >
        {SUPPORTED_LANGUAGES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className={`flex w-full items-center gap-2 px-3 py-2 outline-none ring-0 hover:bg-secondary-hover hover:text-textcolor-primary focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
              (activeLocale as SupportedLanguage) === locale ? 'text-primary' : ''
            }`}
            onSelect={() => replaceLocale(locale)}
          >
            <span className="text-sm">{localeLabelNative[locale as SupportedLanguage]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
