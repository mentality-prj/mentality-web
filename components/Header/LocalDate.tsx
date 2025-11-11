'use client'
import { useLocale } from 'next-intl'

export const LocalDate = () => {
  const locale = useLocale()

  const now = new Date()

  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now)
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(now)

  return (
    <div className="hidden text-textcolor-primary tablet:block desktop:flex desktop:flex-row desktop:text-base">
      <div>{weekday},&nbsp;</div>
      <div>{date}</div>
    </div>
  )
}
