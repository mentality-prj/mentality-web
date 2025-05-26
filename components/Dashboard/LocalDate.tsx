'use client'

import { useEffect, useState } from 'react'

export const LocalDate = () => {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const now = new Date()

    // Formatting the date according to the user's locale.
    // ?? there will be a difference if the user has some settings on their computer,
    // ?? but has selected a different language in their profile settings.
    const formatter = new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

    setFormattedDate(formatter.format(now))
  }, [])

  return <span>{formattedDate}</span>
}
