import SignInButton from '@/components/signin-button'

export default function SignInPage() {
  return (
    <div>
      <SignInButton provider="google" />
      <SignInButton provider="github" />
    </div>
  )
}
