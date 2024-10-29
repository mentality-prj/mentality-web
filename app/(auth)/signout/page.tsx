import SignOutButton from '@/components/SignOutButton'

export default async function Signin() {
  return (
    <div className="mx-auto flex w-full max-w-[200px] flex-col items-center gap-5">
      <h1 className="text-2xl">Signout</h1>
      <SignOutButton />
    </div>
  )
}
