import React from 'react'
import Image from 'next/image'

import { Link } from '@/i18n/navigation'

const Logo = () => {
  return (
    <Link href="/" aria-label="Go to homepage">
      <div
        data-landing-logo
        className="color-[var(--title-color)] flex items-center text-2xl font-bold uppercase leading-none text-[var(--primary)]"
      >
        <span>Dzvin</span>
        <Image src="/logo.png" alt="Dzvin.co" width={40} height={40} priority={false} className="h-10 w-10" />
        <span>co</span>
      </div>
    </Link>
  )
}

export default Logo
