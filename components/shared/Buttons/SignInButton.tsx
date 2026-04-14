'use client'

import { useTranslations } from 'next-intl'

import { ProviderKey, Providers } from '@/constants/providers'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/ui/button'

interface SignInButtonProps {
  provider: ProviderKey
}

export default function SignInButton({ provider }: SignInButtonProps) {
  const providerName = Providers[`${provider}`]
  const t = useTranslations('common.Buttons')
  const textBtn = String(`${t('signInWith')} ${providerName}`)
  const { login } = useAuth()

  return (
    <form
      className="pt-10 text-center"
      onSubmit={(e) => {
        e.preventDefault()
        login()
      }}
    >
      <Button type="submit">{textBtn}</Button>
    </form>
  )
}
