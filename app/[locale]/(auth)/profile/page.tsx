import { auth } from '@/auth'
import Settings from '@/components/Profile/Settings'
import { Card } from '@/ds/shadcn'
// import { Profile, UserProfile } from '@/components/Profile'
import { CustomSession } from '@/types/auth'

export default async function ProfilePage() {
  const session = (await auth()) as CustomSession

  const user = session?.user

  return (
    <Card className="h-fit w-full max-w-[1096px] border-none shadow-none">
      <Settings user={user!} />
      {/* {user?.name && <UserProfile name={user.name} image={user.image} email={user.email} />}
      {user?.isAIAuthorized && user.role && <Profile role={user.role} />} */}
    </Card>
  )
}
