import { Card } from '@nextui-org/react'

import { auth } from '@/auth'
import { Profile, UserProfile } from '@/components/Profile'
import { CustomSession } from '@/types/auth'

export default async function ProfilePage() {
  const session = (await auth()) as CustomSession

  const user = session?.user

  return (
    <Card className="max-w-[400px]">
      {user?.name && <UserProfile name={user.name} image={user.image} email={user.email} />}

      {user?.isAIAuthorized && user.role && <Profile role={user.role} />}
    </Card>
  )
}
