'use client'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import LangSwitch from '@/components/Header/LangSwitch'
import { LandingNav } from '@/components/LandingNav'
import { LoginButton } from '@/components/LoginButton'
import { Logo } from '@/components/Logo'

import { UserMenu } from '../../../../components/Header/UserMenu'

export function LandingHeader() {
  const pathname = usePathname()
  const isLanding = pathname === '/' || pathname === '/[locale]'

  const { data } = useSession()
  const user = data?.user

  return (
    <header className="w-full bg-transparent py-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 tablet:px-6 md:px-8 lg:px-10">
        <Logo />
        <LandingNav />
        <div className="flex shrink-0 items-center gap-5">
          <LangSwitch />
          {user ? (
            <UserMenu
              name={user.name ?? ''}
              email={user.email ?? ''}
              avatarUrl={user.image ?? ''}
              role={user.role ?? ''}
            />
          ) : isLanding ? (
            <LoginButton title="signup" />
          ) : (
            <LoginButton title="login" />
          )}
        </div>
      </div>
    </header>
  )
}
