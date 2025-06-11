'use client'

import { useTranslations } from 'next-intl'

type GreetingTitleProps = {
  userName: string | null
}

export const GreetingTitle = ({ userName }: GreetingTitleProps) => {
  const t = useTranslations()

  const greeting = userName
    ? t('GreetingTitle.personalGreeting', { name: userName })
    : t('GreetingTitle.defaultGreeting')

  return (
    <div className="text-textcolour-primary flex items-center px-[32px] pt-[48px]">
      <span className="text-2xl/8 font-semibold">{greeting}</span>
    </div>
  )
}
