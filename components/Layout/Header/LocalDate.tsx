'use client'
import { Calendar } from 'lucide-react'
import { useLocale } from 'next-intl'

const LocalDate = () => {
  const locale = useLocale()

  const now = new Date()

  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now)
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(now)
  const shortDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(now)

  return (
    <div className="text-textcolor-tertiary flex items-center gap-1 text-sm">
      <Calendar size={12} />
      <span className="lg:hidden">
        <em>{shortDate}</em>
      </span>
      <span className="hidden lg:contents">
        <em>{weekday},</em>
        <em>{date}</em>
      </span>
    </div>
  )
}

export default LocalDate
