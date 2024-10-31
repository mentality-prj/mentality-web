import { auth } from '@/auth'
import { SignOut } from '@/components/signout-button'

export default async function ProfilePage() {
  const session = await auth()
  return (
    <div className="flex flex-col items-center gap-10">
      {session?.user && (
        <div className="flex flex-col gap-5">
          <div className="">{session.user.email}</div>
          <div className="">{session.user.name}</div>

          {session.user.image && <img src={session.user.image} />}
        </div>
      )}
      <SignOut />
    </div>
  )
}
