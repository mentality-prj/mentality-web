import { signIn } from '@/auth'

export default function SignInButton({ provider }: { provider: string }) {
  const textBtn = provider === 'google' ? 'Google' : 'Github'

  return (
    <form
      className="pt-10 text-center"
      action={async () => {
        'use server'
        await signIn(provider, { redirectTo: '/' })
      }}
    >
      <button className="text-3xl" type="submit">
        Signin with {textBtn}
      </button>
    </form>
  )
}
