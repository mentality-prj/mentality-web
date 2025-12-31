import { getLocale } from 'next-intl/server'

import { LocalizedText } from '@/types/achievements'
import { SupportedLanguage } from '@/types/languages'

export const Insight = async ({ text }: { text: LocalizedText }) => {
  const locale = (await getLocale()) as SupportedLanguage
  return (
    <div className="background-alt flex items-center gap-default rounded p-6">
      <span className="h-3 w-3 shrink-0 rounded-full bg-[#16A34A]"></span>
      <span className="text-base text-textcolor-secondary">{text[`${locale}`]}</span>
    </div>
  )
}
