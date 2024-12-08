import { Chip } from '@nextui-org/react'

import { auth } from '@/auth'
import { SignOutButton } from '@/components'
import { CheckIcon } from '@/components/icons/check-icon'
import { CustomSession } from '@/types/auth'

export default async function ProfilePage() {
  const session = (await auth()) as CustomSession

  const user = session?.user

  return (
    <div className="mt-12 flex flex-col items-center gap-10">
      {user?.name && (
        <div className="flex w-full max-w-lg flex-col gap-5">
          <h1>Welcome, {user.name}</h1>
          <p>Your emain is: {user.email}</p>
        </div>
      )}

      {user?.isAIAuthorized && user.role && (
        // AI Area
        <div className="flex w-full max-w-lg flex-col gap-5">
          <h1 className="flex gap-1.5">
            AI user: {user.name}
            <sup>
              <Chip size="sm" startContent={<CheckIcon />} variant="faded" color="success">
                AI connected
              </Chip>
            </sup>
          </h1>
          <div className="flex gap-1.5">Your role is: {user.role}</div>
        </div>
      )}

      <SignOutButton />
    </div>
  )
}
