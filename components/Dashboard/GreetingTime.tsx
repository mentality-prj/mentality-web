'use client'

import { useEffect, useState } from 'react'

// needs to improve the output of the greeting in the language selected in the settings

export const GreetingTime = () => {
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    const hours = new Date().getHours()
    if (hours < 12) setGreeting('Good morning')
    else if (hours < 18) setGreeting('Have a nice day')
    else setGreeting('Good evening')
  }, [])

  return <span>{greeting}, </span>
}
