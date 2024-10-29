import { GithubButton } from '@/components/GithubButton'
import { GoogleButton } from '@/components/GoogleButton'

export default async function Signin() {
  return (
    <div className="mx-auto flex w-full max-w-[200px] flex-col items-center gap-5">
      <h1 className="text-2xl">SignIn</h1>
      <GoogleButton />
      <GithubButton />
    </div>
  )
}
