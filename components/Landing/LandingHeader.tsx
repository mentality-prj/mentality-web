'use client'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { AvatarMenu, LangSwitch, Logo } from '@/components/Header'
import { LandingNav } from '@/components/Landing'
import { LoginButton } from '@/components/LoginButton'

const LandingHeader = () => {
  const pathname = usePathname()
  const isLanding = pathname === '/' || pathname === '/[locale]'

  const { data } = useSession()
  const user = data?.user

  return (
    <header className="w-full bg-transparent py-4">
      <div className="container-max-width mx-auto flex items-center justify-between px-4 tablet:px-6 md:px-8 lg:px-10">
        <Logo />
        <LandingNav />
        <div className="flex shrink-0 items-center gap-5">
          <LangSwitch />
          {user ? <AvatarMenu /> : isLanding ? <LoginButton title="signup" /> : <LoginButton title="login" />}
        </div>
      </div>
    </header>
  )
}

export default LandingHeader
