import { Profile, UserProfile } from '@/components/features/Profile'
import { getServerSession } from '@/lib/get-server-session'

export default async function ProfilePage() {
  const session = await getServerSession()

  const user = session?.user

  return (
    <div className="max-w-[400px]">
      {user?.name && <UserProfile name={user.name} image={user.image} email={user.email} />}
      {user?.isAIAuthorized && user.role && <Profile role={user.role} />}
    </div>
  )
}
