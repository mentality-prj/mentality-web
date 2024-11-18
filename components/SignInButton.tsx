import { Button } from '@nextui-org/react'

import { signIn } from '@/auth'
import { ProviderKey, Providers } from '@/constants/providers'
import { Routes } from '@/constants/routes'

interface IProvider {
  provider: ProviderKey
}

export default function SignInButton({ provider }: IProvider) {
  const textBtn = String(`Signin with ${Providers[provider]}`)

  return (
    <form
      className="pt-10 text-center"
      action={async () => {
        'use server'
        await signIn(provider, { redirectTo: Routes.PROFILE })
      }}
    >
      <Button color="primary" type="submit">
        {textBtn}
      </Button>
    </form>
  )
}
