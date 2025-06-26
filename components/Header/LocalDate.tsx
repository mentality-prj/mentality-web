'use client'
import { useLocale } from 'next-intl'

export const LocalDate = ({ className }: { className?: string }) => {
  const locale = useLocale()

  const now = new Date()
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const formattedDate = formatter.format(now)

  return <span className={className}>{formattedDate}</span>
}
