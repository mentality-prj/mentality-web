import { getServerSession } from 'next-auth'

import SignOutButton from '@/components/SignOutButton'

export default async function Profile() {
  const session = await getServerSession()
  return (
    <div className="flex flex-col items-center gap-20">
      <div className="text-center text-2xl">Profile info</div>
      <div className="">{session?.user?.name}</div>
      <div className="">{session?.user?.image && <img src={session?.user?.image} alt="profile avatar" />}</div>
      <div className="">{session?.user?.email}</div>
      <SignOutButton />
    </div>
  )
}
