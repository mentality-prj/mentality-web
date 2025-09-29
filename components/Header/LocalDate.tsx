'use client'
import { useLocale } from 'next-intl'

export const LocalDate = ({ className }: { className?: string }) => {
  const locale = useLocale()

  const now = new Date()

  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now)
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(now)

  return (
    <div className={className}>
      <div className="hidden flex-col tablet:flex desktop:flex-row">
        <div>{weekday},&nbsp;</div>
        <div>{date}</div>
      </div>
    </div>
  )
}
