'use client'
import { useTransition } from 'react'
import { Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

import { APP_VIEW_TYPE, AppViewType } from '@/constants/general'
import { usePathname } from '@/i18n/navigation'
import { LocaleNativeLabels, LocaleTriggerShortLabels, SupportedLanguage, supportedLanguages } from '@/types/languages'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu'

export default function LangSwitch({ type }: { type?: AppViewType }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const activeLocale = useLocale()
  const pathname = usePathname()

  const replaceLocale = (nextLocale: SupportedLanguage) => {
    const segments = pathname.split('/')
    const maybeLocale = segments[1] as SupportedLanguage | undefined
    const isLocalePrefixed = maybeLocale && supportedLanguages.includes(maybeLocale)
    const currentPath = isLocalePrefixed ? `/${segments.slice(2).join('/')}` : pathname
    startTransition(() => {
      router.replace(`/${nextLocale}${currentPath}`)
    })
  }

  const localeLabelNative = LocaleNativeLabels
  const localeTriggerShort = LocaleTriggerShortLabels

  let textColor: string
  switch (type) {
    case APP_VIEW_TYPE.LANDING:
      textColor = 'text-textcolor-primary group-hover:font-semibold'
      break
    case APP_VIEW_TYPE.ADMIN:
      textColor = 'text-admin-text'
      break
    default:
      textColor = 'text-remark group-hover:font-semibold'
      break
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className={`group flex items-center gap-1.5 bg-transparent p-0 text-sm outline-none disabled:opacity-50 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="inline-flex w-4 items-center justify-center">
            <Globe size={18} className={textColor} />
          </span>
          <span className={`text-sm font-medium leading-none group-hover:underline ${textColor}`}>
            {localeTriggerShort[activeLocale as SupportedLanguage]}
          </span>
          <span className={`inline-flex w-3 items-center justify-center text-xs ${textColor}`}>▾</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[200px] rounded-2xl border border-white bg-white px-0 text-textcolor-primary shadow-lg outline-none ring-0 focus:outline-none"
      >
        {supportedLanguages.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className={`hover:bg-secondary-hover flex w-full items-center gap-xs px-3 py-2 outline-none ring-0 hover:text-textcolor-primary focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
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
